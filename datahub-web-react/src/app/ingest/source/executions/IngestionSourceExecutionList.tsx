import React, { useEffect, useState } from 'react';
import { message, Modal } from 'antd';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
    useGetIngestionSourceQuery,
    useCancelIngestionExecutionRequestMutation,
    useRollbackIngestionMutation,
} from '../../../../graphql/ingestion.generated';
import { Message } from '../../../shared/Message';
import { ExecutionDetailsModal } from './ExecutionRequestDetailsModal';
import IngestionExecutionTable from './IngestionExecutionTable';
import { ExecutionRequest } from '../../../../types.generated';
import { ROLLING_BACK, RUNNING } from '../utils';
import useRefreshIngestionData from './useRefreshIngestionData';

const ListContainer = styled.div`
    margin-left: 28px;
`;

export function isExecutionRequestActive(executionRequest: ExecutionRequest) {
    return executionRequest.result?.status === RUNNING || executionRequest.result?.status === ROLLING_BACK;
}

type Props = {
    urn: string;
    isExpanded: boolean;
    lastRefresh: number;
    onRefresh: () => void;
};

export const IngestionSourceExecutionList = ({ urn, isExpanded, lastRefresh, onRefresh }: Props) => {
    const { t } = useTranslation();
    const [focusExecutionUrn, setFocusExecutionUrn] = useState<undefined | string>(undefined);

    const start = 0;
    const count = 10; // Load 10 items at a time.

    const { loading, data, error, refetch } = useGetIngestionSourceQuery({
        variables: {
            urn,
            runStart: start,
            runCount: count,
        },
    });

    function hasActiveExecution() {
        return !!data?.ingestionSource?.executions?.executionRequests.find((request) =>
            isExecutionRequestActive(request as ExecutionRequest),
        );
    }
    useRefreshIngestionData(refetch, hasActiveExecution);

    const [cancelExecutionRequestMutation] = useCancelIngestionExecutionRequestMutation();
    const [rollbackIngestion] = useRollbackIngestionMutation();

    useEffect(() => {
        if (isExpanded) {
            refetch();
        }
    }, [lastRefresh, isExpanded, refetch]);

    const handleViewDetails = (focusUrn: string) => {
        setFocusExecutionUrn(focusUrn);
    };

    const onCancelExecutionRequest = (executionUrn: string) => {
        cancelExecutionRequestMutation({
            variables: {
                input: {
                    ingestionSourceUrn: urn,
                    executionRequestUrn: executionUrn,
                },
            },
        })
            .catch((e) => {
                message.destroy();
                message.error({
                    content: `${t('ingest.failedToCancelExecution')}: \n ${e.message || ''}`,
                    duration: 3,
                });
            })
            .finally(() => {
                message.success({
                    content: t('ingest.successfullySubmittedCancellationRequest'),
                    duration: 3,
                });
                // Refresh once a job was cancelled.
                setTimeout(() => onRefresh(), 2000);
            });
    };

    const handleCancelExecution = (executionUrn: string) => {
        Modal.confirm({
            title: t('ingest.confirmCancelModalTitle'),
            content: t('ingest.confirmCancelModalContent'),
            onOk() {
                onCancelExecutionRequest(executionUrn);
            },
            onCancel() {},
            okText: t('common.yes'),
            cancelText: t('common.cancel'),
            maskClosable: true,
            closable: true,
        });
    };

    function handleRollbackExecution(runId: string) {
        Modal.confirm({
            title: t('ingest.confirmRollbackModalTitle'),
            content: (
                <div>
                    {t('ingest.confirmRollbackModalContent')}
                    <br />
                    <br /> {t('ingest.areYouSureYouWantToContinue')}
                </div>
            ),
            onOk() {
                message.loading(`${t('ingest.requestingRollback')}...`);
                rollbackIngestion({ variables: { input: { runId } } })
                    .then(() => {
                        setTimeout(() => {
                            message.destroy();
                            refetch();
                            onRefresh();
                            message.success(t('ingest.successfullyRequestedIngestionRollback'));
                        }, 2000);
                    })
                    .catch(() => {
                        message.error(t('ingest.errorRequestingIngestionRollback'));
                    });
            },
            onCancel() {},
            okText: t('common.rollback'),
            cancelText: t('common.cancel'),
            maskClosable: true,
            closable: true,
        });
    }

    const executionRequests = (data?.ingestionSource?.executions?.executionRequests as ExecutionRequest[]) || [];

    return (
        <ListContainer>
            {!data && loading && <Message type="loading" content={`${t('ingest.loadingExecutions')}...`} />}
            {error && <Message type="error" content={t('ingest.failedToLoadIngestionExecutionAnErrorOccurred')} />}
            <IngestionExecutionTable
                executionRequests={executionRequests}
                setFocusExecutionUrn={setFocusExecutionUrn}
                handleCancelExecution={handleCancelExecution}
                handleViewDetails={handleViewDetails}
                handleRollbackExecution={handleRollbackExecution}
            />
            {focusExecutionUrn && (
                <ExecutionDetailsModal
                    urn={focusExecutionUrn}
                    visible={focusExecutionUrn !== undefined}
                    onClose={() => setFocusExecutionUrn(undefined)}
                />
            )}
        </ListContainer>
    );
};
