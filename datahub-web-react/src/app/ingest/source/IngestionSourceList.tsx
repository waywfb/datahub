import { PlusOutlined, RedoOutlined } from '@ant-design/icons';
import React, { useCallback, useEffect, useState } from 'react';
import * as QueryString from 'query-string';
import { useLocation } from 'react-router';
import { Button, message, Modal, Pagination, Select } from 'antd';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
    useCreateIngestionExecutionRequestMutation,
    useCreateIngestionSourceMutation,
    useDeleteIngestionSourceMutation,
    useListIngestionSourcesQuery,
    useUpdateIngestionSourceMutation,
} from '../../../graphql/ingestion.generated';
import { Message } from '../../shared/Message';
import TabToolbar from '../../entity/shared/components/styled/TabToolbar';
import { IngestionSourceBuilderModal } from './builder/IngestionSourceBuilderModal';
import { addToListIngestionSourcesCache, CLI_EXECUTOR_ID, removeFromListIngestionSourcesCache } from './utils';
import { DEFAULT_EXECUTOR_ID, SourceBuilderState } from './builder/types';
import { IngestionSource, UpdateIngestionSourceInput } from '../../../types.generated';
import { SearchBar } from '../../search/SearchBar';
import { useEntityRegistry } from '../../useEntityRegistry';
import { ExecutionDetailsModal } from './executions/ExecutionRequestDetailsModal';
import RecipeViewerModal from './RecipeViewerModal';
import IngestionSourceTable from './IngestionSourceTable';
import { scrollToTop } from '../../shared/searchUtils';
import useRefreshIngestionData from './executions/useRefreshIngestionData';
import { isExecutionRequestActive } from './executions/IngestionSourceExecutionList';
import analytics, { EventType } from '../../analytics';
import {
    INGESTION_CREATE_SOURCE_ID,
    INGESTION_REFRESH_SOURCES_ID,
} from '../../onboarding/config/IngestionOnboardingConfig';

const PLACEHOLDER_URN = 'placeholder-urn';

const SourceContainer = styled.div``;

const SourcePaginationContainer = styled.div`
    display: flex;
    justify-content: center;
`;

const StyledSelect = styled(Select)`
    margin-right: 15px;
    min-width: 75px;
`;

const FilterWrapper = styled.div`
    display: flex;
`;

export enum IngestionSourceType {
    ALL,
    UI,
    CLI,
}

export function shouldIncludeSource(source: any, sourceFilter: IngestionSourceType) {
    if (sourceFilter === IngestionSourceType.CLI) {
        return source.config.executorId === CLI_EXECUTOR_ID;
    }
    if (sourceFilter === IngestionSourceType.UI) {
        return source.config.executorId !== CLI_EXECUTOR_ID;
    }
    return true;
}

const DEFAULT_PAGE_SIZE = 25;

const removeExecutionsFromIngestionSource = (source) => {
    if (source) {
        return {
            name: source.name,
            type: source.type,
            schedule: source.schedule,
            config: source.config,
        };
    }
    return undefined;
};

export const IngestionSourceList = () => {
    const { t } = useTranslation();
    const entityRegistry = useEntityRegistry();
    const location = useLocation();
    const params = QueryString.parse(location.search, { arrayFormat: 'comma' });
    const paramsQuery = (params?.query as string) || undefined;
    const [query, setQuery] = useState<undefined | string>(undefined);
    useEffect(() => setQuery(paramsQuery), [paramsQuery]);

    const [page, setPage] = useState(1);

    const pageSize = DEFAULT_PAGE_SIZE;
    const start = (page - 1) * pageSize;

    const [isBuildingSource, setIsBuildingSource] = useState<boolean>(false);
    const [isViewingRecipe, setIsViewingRecipe] = useState<boolean>(false);
    const [focusSourceUrn, setFocusSourceUrn] = useState<undefined | string>(undefined);
    const [focusExecutionUrn, setFocusExecutionUrn] = useState<undefined | string>(undefined);
    const [lastRefresh, setLastRefresh] = useState(0);
    // Set of removed urns used to account for eventual consistency
    const [removedUrns, setRemovedUrns] = useState<string[]>([]);
    const [sourceFilter, setSourceFilter] = useState(IngestionSourceType.ALL);

    // Ingestion Source Queries
    const { loading, error, data, client, refetch } = useListIngestionSourcesQuery({
        variables: {
            input: {
                start,
                count: pageSize,
                query,
            },
        },
        fetchPolicy: 'cache-first',
    });
    const [createIngestionSource] = useCreateIngestionSourceMutation();
    const [updateIngestionSource] = useUpdateIngestionSourceMutation();

    // Execution Request queries
    const [createExecutionRequestMutation] = useCreateIngestionExecutionRequestMutation();
    const [removeIngestionSourceMutation] = useDeleteIngestionSourceMutation();

    const totalSources = data?.listIngestionSources?.total || 0;
    const sources = data?.listIngestionSources?.ingestionSources || [];
    const filteredSources = sources.filter(
        (source) => !removedUrns.includes(source.urn) && shouldIncludeSource(source, sourceFilter),
    ) as IngestionSource[];
    const focusSource =
        (focusSourceUrn && filteredSources.find((source) => source.urn === focusSourceUrn)) || undefined;

    const onRefresh = useCallback(() => {
        refetch();
        // Used to force a re-render of the child execution request list.
        setLastRefresh(new Date().getTime());
    }, [refetch]);

    function hasActiveExecution() {
        return !!filteredSources.find((source) =>
            source.executions?.executionRequests.find((request) => isExecutionRequestActive(request)),
        );
    }
    useRefreshIngestionData(onRefresh, hasActiveExecution);

    const executeIngestionSource = (urn: string) => {
        createExecutionRequestMutation({
            variables: {
                input: {
                    ingestionSourceUrn: urn,
                },
            },
        })
            .then(() => {
                analytics.event({
                    type: EventType.ExecuteIngestionSourceEvent,
                });
                message.success({
                    content: t('ingest.successfullySubmittedIngestionExecutionRequest'),
                    duration: 3,
                });
                setTimeout(() => onRefresh(), 3000);
            })
            .catch((e) => {
                message.destroy();
                message.error({
                    content: `${t('ingest.failedToSubmitIngestionExecutionRequest')}: \n ${e.message || ''}`,
                    duration: 3,
                });
            });
    };

    const onCreateOrUpdateIngestionSourceSuccess = () => {
        setTimeout(() => refetch(), 2000);
        setIsBuildingSource(false);
        setFocusSourceUrn(undefined);
    };

    const createOrUpdateIngestionSource = (
        input: UpdateIngestionSourceInput,
        resetState: () => void,
        shouldRun?: boolean,
    ) => {
        if (focusSourceUrn) {
            // Update:
            updateIngestionSource({ variables: { urn: focusSourceUrn as string, input } })
                .then(() => {
                    analytics.event({
                        type: EventType.UpdateIngestionSourceEvent,
                        sourceType: input.type,
                        interval: input.schedule?.interval,
                    });
                    message.success({
                        content: t('ingest.successfullyUpdatedIngestionSource'),
                        duration: 3,
                    });
                    onCreateOrUpdateIngestionSourceSuccess();
                    resetState();
                    if (shouldRun) executeIngestionSource(focusSourceUrn);
                })
                .catch((e) => {
                    message.destroy();
                    message.error({
                        content: `${t('ingest.failedToUpdateIngestionSource')}: \n ${e.message || ''}`,
                        duration: 3,
                    });
                });
        } else {
            // Create
            createIngestionSource({ variables: { input } })
                .then((result) => {
                    message.loading({ content: `${t('common.loading')}...`, duration: 2 });
                    const newSource = {
                        urn: result?.data?.createIngestionSource || PLACEHOLDER_URN,
                        name: input.name,
                        type: input.type,
                        config: null,
                        schedule: {
                            interval: input.schedule?.interval || null,
                            timezone: input.schedule?.timezone || null,
                        },
                        platform: null,
                        executions: null,
                    };
                    addToListIngestionSourcesCache(client, newSource, pageSize, query);
                    setTimeout(() => {
                        refetch();
                        analytics.event({
                            type: EventType.CreateIngestionSourceEvent,
                            sourceType: input.type,
                            interval: input.schedule?.interval,
                        });
                        message.success({
                            content: t('ingest.successfullyCreatedIngestionSource'),
                            duration: 3,
                        });
                        if (shouldRun && result.data?.createIngestionSource) {
                            executeIngestionSource(result.data.createIngestionSource);
                        }
                    }, 2000);
                    setIsBuildingSource(false);
                    setFocusSourceUrn(undefined);
                    resetState();
                })
                .catch((e) => {
                    message.destroy();
                    message.error({
                        content: `${t('ingest.failedToCreateIngestionSource')}: \n ${e.message || ''}`,
                        duration: 3,
                    });
                });
        }
    };

    const onChangePage = (newPage: number) => {
        scrollToTop();
        setPage(newPage);
    };

    const deleteIngestionSource = (urn: string) => {
        removeFromListIngestionSourcesCache(client, urn, page, pageSize, query);
        removeIngestionSourceMutation({
            variables: { urn },
        })
            .then(() => {
                analytics.event({
                    type: EventType.DeleteIngestionSourceEvent,
                });
                message.success({ content: t('ingest.removedIngestionSource'), duration: 2 });
                const newRemovedUrns = [...removedUrns, urn];
                setRemovedUrns(newRemovedUrns);
                setTimeout(() => {
                    refetch?.();
                }, 3000);
            })
            .catch((e: unknown) => {
                message.destroy();
                if (e instanceof Error) {
                    message.error({
                        content: `${t('ingest.failedToRemoveIngestionSource')}: \n ${e.message || ''}`,
                        duration: 3,
                    });
                }
            });
    };

    const onSubmit = (recipeBuilderState: SourceBuilderState, resetState: () => void, shouldRun?: boolean) => {
        createOrUpdateIngestionSource(
            {
                type: recipeBuilderState.type as string,
                name: recipeBuilderState.name as string,
                config: {
                    recipe: recipeBuilderState.config?.recipe as string,
                    version:
                        (recipeBuilderState.config?.version?.length &&
                            (recipeBuilderState.config?.version as string)) ||
                        undefined,
                    executorId:
                        (recipeBuilderState.config?.executorId?.length &&
                            (recipeBuilderState.config?.executorId as string)) ||
                        DEFAULT_EXECUTOR_ID,
                    debugMode: recipeBuilderState.config?.debugMode || false,
                },
                schedule: recipeBuilderState.schedule && {
                    interval: recipeBuilderState.schedule?.interval as string,
                    timezone: recipeBuilderState.schedule?.timezone as string,
                },
            },
            resetState,
            shouldRun,
        );
    };

    const onEdit = (urn: string) => {
        setIsBuildingSource(true);
        setFocusSourceUrn(urn);
    };

    const onView = (urn: string) => {
        setIsViewingRecipe(true);
        setFocusSourceUrn(urn);
    };

    const onExecute = (urn: string) => {
        Modal.confirm({
            title: t('ingest.confirmSourceExecutionModalTitle'),
            content: t('ingest.confirmSourceExecutionModalContent'),
            onOk() {
                executeIngestionSource(urn);
            },
            onCancel() {},
            okText: t('common.execute'),
            cancelText: t('common.cancel'),
            maskClosable: true,
            closable: true,
        });
    };

    const onDelete = (urn: string) => {
        Modal.confirm({
            title: t('ingest.confirmIngestionRemovalModalTitle'),
            content: t('ingest.confirmIngestionRemovalModalContent'),
            onOk() {
                deleteIngestionSource(urn);
            },
            onCancel() {},
            okText: t('common.yes'),
            cancelText: t('common.cancel'),
            maskClosable: true,
            closable: true,
        });
    };

    const onCancel = () => {
        setIsBuildingSource(false);
        setIsViewingRecipe(false);
        setFocusSourceUrn(undefined);
    };

    return (
        <>
            {!data && loading && <Message type="loading" content={`${t('ingest.loadingIngestionSources')}...`} />}
            {error && <Message type="error" content={t('ingest.failedToLoadIngestionSourcesAnErrorOccurred')} />}
            <SourceContainer>
                <TabToolbar>
                    <div>
                        <Button id={INGESTION_CREATE_SOURCE_ID} type="text" onClick={() => setIsBuildingSource(true)}>
                            <PlusOutlined /> {t('ingest.createNewSource')}
                        </Button>
                        <Button id={INGESTION_REFRESH_SOURCES_ID} type="text" onClick={onRefresh}>
                            <RedoOutlined /> {t('common.refresh')}
                        </Button>
                    </div>
                    <FilterWrapper>
                        <StyledSelect
                            value={sourceFilter}
                            onChange={(selection) => setSourceFilter(selection as IngestionSourceType)}
                        >
                            <Select.Option value={IngestionSourceType.ALL}>{t('common.all')}</Select.Option>
                            <Select.Option value={IngestionSourceType.UI}>{t('ingest.ui')}</Select.Option>
                            <Select.Option value={IngestionSourceType.CLI}>{t('ingest.cli')}</Select.Option>
                        </StyledSelect>

                        <SearchBar
                            initialQuery={query || ''}
                            placeholderText={`${t('ingest.searchSources')}...`}
                            suggestions={[]}
                            style={{
                                maxWidth: 220,
                                padding: 0,
                            }}
                            inputStyle={{
                                height: 32,
                                fontSize: 12,
                            }}
                            onSearch={() => null}
                            onQueryChange={(q) => setQuery(q)}
                            entityRegistry={entityRegistry}
                            hideRecommendations
                        />
                    </FilterWrapper>
                </TabToolbar>
                <IngestionSourceTable
                    lastRefresh={lastRefresh}
                    sources={filteredSources || []}
                    setFocusExecutionUrn={setFocusExecutionUrn}
                    onExecute={onExecute}
                    onEdit={onEdit}
                    onView={onView}
                    onDelete={onDelete}
                    onRefresh={onRefresh}
                />
                <SourcePaginationContainer>
                    <Pagination
                        style={{ margin: 40 }}
                        current={page}
                        pageSize={pageSize}
                        total={totalSources}
                        showLessItems
                        onChange={onChangePage}
                        showSizeChanger={false}
                    />
                </SourcePaginationContainer>
            </SourceContainer>
            <IngestionSourceBuilderModal
                initialState={removeExecutionsFromIngestionSource(focusSource)}
                visible={isBuildingSource}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
            {isViewingRecipe && <RecipeViewerModal recipe={focusSource?.config.recipe} onCancel={onCancel} />}
            {focusExecutionUrn && (
                <ExecutionDetailsModal
                    urn={focusExecutionUrn}
                    visible
                    onClose={() => setFocusExecutionUrn(undefined)}
                />
            )}
        </>
    );
};
