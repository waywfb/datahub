import React, { useEffect, useState } from 'react';
import { Button, Empty, message, Modal, Pagination, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import * as QueryString from 'query-string';
import { useLocation } from 'react-router';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
    useCreateSecretMutation,
    useDeleteSecretMutation,
    useListSecretsQuery,
} from '../../../graphql/ingestion.generated';
import { Message } from '../../shared/Message';
import TabToolbar from '../../entity/shared/components/styled/TabToolbar';
import { SecretBuilderModal } from './SecretBuilderModal';
import { SecretBuilderState } from './types';
import { StyledTable } from '../../entity/shared/components/styled/StyledTable';
import { SearchBar } from '../../search/SearchBar';
import { useEntityRegistry } from '../../useEntityRegistry';
import { scrollToTop } from '../../shared/searchUtils';
import { addSecretToListSecretsCache, removeSecretFromListSecretsCache } from './cacheUtils';

const DeleteButtonContainer = styled.div`
    display: flex;
    justify-content: right;
`;

const SourcePaginationContainer = styled.div`
    display: flex;
    justify-content: center;
`;

const DEFAULT_PAGE_SIZE = 25;

export const SecretsList = () => {
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

    // Whether or not there is an urn to show in the modal
    const [isCreatingSecret, setIsCreatingSecret] = useState<boolean>(false);

    const [deleteSecretMutation] = useDeleteSecretMutation();
    const [createSecretMutation] = useCreateSecretMutation();
    const { loading, error, data, client } = useListSecretsQuery({
        variables: {
            input: {
                start,
                count: pageSize,
                query: query && query.length > 0 ? query : undefined,
            },
        },
        fetchPolicy: query && query.length > 0 ? 'no-cache' : 'cache-first',
    });

    const totalSecrets = data?.listSecrets?.total || 0;
    const secrets = data?.listSecrets?.secrets || [];

    const deleteSecret = (urn: string) => {
        deleteSecretMutation({
            variables: { urn },
        })
            .then(() => {
                message.success({
                    content: t('crud.success.moveWithNameReverse', { name: t('common.secret').toLowerCase() }),
                    duration: 2,
                });
                removeSecretFromListSecretsCache(urn, client, page, pageSize);
            })
            .catch((e: unknown) => {
                message.destroy();
                if (e instanceof Error) {
                    message.error({
                        content: `${t('crud.error.removeWithName', { name: t('common.secret').toLowerCase() })}: \n ${
                            e.message || ''
                        }`,
                        duration: 3,
                    });
                }
            });
    };

    const onChangePage = (newPage: number) => {
        scrollToTop();
        setPage(newPage);
    };

    const onSubmit = (state: SecretBuilderState, resetBuilderState: () => void) => {
        createSecretMutation({
            variables: {
                input: {
                    name: state.name as string,
                    value: state.value as string,
                    description: state.description as string,
                },
            },
        })
            .then((res) => {
                message.success({
                    content: t('crud.success.successfullyCreateWithName', { name: t('common.secret') }),
                    duration: 3,
                });
                resetBuilderState();
                setIsCreatingSecret(false);
                addSecretToListSecretsCache(
                    {
                        urn: res.data?.createSecret || '',
                        name: state.name,
                        description: state.description,
                    },
                    client,
                    pageSize,
                );
            })
            .catch((e) => {
                message.destroy();
                message.error({
                    content: `${t('ingest.failedToUpdateIngestionSource')}: \n ${e.message || ''}`,
                    duration: 3,
                });
            });
    };

    const onDeleteSecret = (urn: string) => {
        Modal.confirm({
            title: `Confirm Secret Removal`,
            content: `Are you sure you want to remove this secret? Sources that use it may no longer work as expected.`,
            onOk() {
                deleteSecret(urn);
            },
            onCancel() {},
            okText: t('common.yes'),
            cancelText: t('common.cancel'),
            maskClosable: true,
            closable: true,
        });
    };

    const tableColumns = [
        {
            title: t('common.name'),
            dataIndex: 'name',
            key: 'name',
            render: (name: string) => <Typography.Text strong>{name}</Typography.Text>,
        },
        {
            title: t('common.description'),
            dataIndex: 'description',
            key: 'description',
            render: (description: any) => {
                return (
                    <>
                        {description || <Typography.Text type="secondary">{t('common.noDescription')}</Typography.Text>}
                    </>
                );
            },
        },
        {
            title: '',
            dataIndex: '',
            key: 'x',
            render: (_, record: any) => (
                <DeleteButtonContainer>
                    <Button onClick={() => onDeleteSecret(record.urn)} type="text" shape="circle" danger>
                        <DeleteOutlined />
                    </Button>
                </DeleteButtonContainer>
            ),
        },
    ];

    const tableData = secrets?.map((secret) => ({
        urn: secret.urn,
        name: secret.name,
        description: secret.description,
    }));

    return (
        <>
            {!data && loading && <Message type="loading" content={`${t('common.loading')}...`} />}
            {error &&
                message.error({
                    content: `${t('ingest.failedToLoadSecrets')} \n ${error.message || ''}`,
                    duration: 3,
                })}
            <div>
                <TabToolbar>
                    <div>
                        <Button type="text" onClick={() => setIsCreatingSecret(true)}>
                            <PlusOutlined /> {t('ingest.createNewSecret')}
                        </Button>
                    </div>
                    <SearchBar
                        initialQuery={query || ''}
                        placeholderText={t('ingest.searchSecrets')}
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
                </TabToolbar>
                <StyledTable
                    columns={tableColumns}
                    dataSource={tableData}
                    rowKey="urn"
                    locale={{
                        emptyText: (
                            <Empty
                                description={`${t('ingest.noSecretsFound')}!`}
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        ),
                    }}
                    pagination={false}
                />
                <SourcePaginationContainer>
                    <Pagination
                        style={{ margin: 40 }}
                        current={page}
                        pageSize={pageSize}
                        total={totalSecrets}
                        showLessItems
                        onChange={onChangePage}
                        showSizeChanger={false}
                    />
                </SourcePaginationContainer>
            </div>
            <SecretBuilderModal
                visible={isCreatingSecret}
                onSubmit={onSubmit}
                onCancel={() => setIsCreatingSecret(false)}
            />
        </>
    );
};
