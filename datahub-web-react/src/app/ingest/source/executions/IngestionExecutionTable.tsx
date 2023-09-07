import React from 'react';
import { Empty } from 'antd';
import { useTranslation } from 'react-i18next';
import { StyledTable } from '../../../entity/shared/components/styled/StyledTable';
import { ExecutionRequest } from '../../../../types.generated';
import { ButtonsColumn, SourceColumn, StatusColumn, TimeColumn } from './IngestionExecutionTableColumns';
import { SUCCESS } from '../utils';

interface Props {
    executionRequests: ExecutionRequest[];
    setFocusExecutionUrn: (urn: string) => void;
    handleViewDetails: (urn: string) => void;
    handleCancelExecution: (urn: string) => void;
    handleRollbackExecution: (runId: string) => void;
}

export default function IngestionExecutionTable({
    executionRequests,
    setFocusExecutionUrn,
    handleViewDetails,
    handleCancelExecution,
    handleRollbackExecution,
}: Props) {
    const { t } = useTranslation();
    const tableColumns = [
        {
            title: t('ingest.requestedAt'),
            dataIndex: 'requestedAt',
            key: 'requestedAt',
            render: TimeColumn,
        },
        {
            title: t('ingest.startedAt'),
            dataIndex: 'executedAt',
            key: 'executedAt',
            render: TimeColumn,
        },
        {
            title: `${t('ingest.duration')} (s)`,
            dataIndex: 'duration',
            key: 'duration',
            render: (durationMs: number) => {
                const seconds = (durationMs && `${durationMs / 1000}s`) || t('common.none');
                return seconds;
            },
        },
        {
            title: t('common.status'),
            dataIndex: 'status',
            key: 'status',
            render: (status: any, record) => (
                <StatusColumn status={status} record={record} setFocusExecutionUrn={setFocusExecutionUrn} />
            ),
        },
        {
            title: t('common.source'),
            dataIndex: 'source',
            key: 'source',
            render: SourceColumn,
        },
        {
            title: '',
            dataIndex: '',
            key: 'x',
            render: (_, record: any) => (
                <ButtonsColumn
                    record={record}
                    handleViewDetails={handleViewDetails}
                    handleCancelExecution={handleCancelExecution}
                    handleRollbackExecution={handleRollbackExecution}
                />
            ),
        },
    ];

    const mostRecentSuccessfulExecution = executionRequests.find((execution) => execution.result?.status === SUCCESS);

    const tableData = executionRequests.map((execution) => ({
        urn: execution.urn,
        id: execution.id,
        source: execution.input.source.type,
        requestedAt: execution.input?.requestedAt,
        executedAt: execution.result?.startTimeMs,
        duration: execution.result?.durationMs,
        status: execution.result?.status,
        showRollback: execution.urn === mostRecentSuccessfulExecution?.urn,
    }));

    return (
        <StyledTable
            columns={tableColumns}
            dataSource={tableData}
            rowKey="id"
            locale={{
                emptyText: <Empty description={t('ingest.noExecutionFound')} image={Empty.PRESENTED_IMAGE_SIMPLE} />,
            }}
            pagination={false}
        />
    );
}
