import React from 'react';
import { CopyOutlined } from '@ant-design/icons';
import { Button, Typography, Tooltip } from 'antd';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import {
    getExecutionRequestStatusDisplayColor,
    getExecutionRequestStatusIcon,
    getExecutionRequestStatusDisplayText,
    CLI_INGESTION_SOURCE,
    SCHEDULED_INGESTION_SOURCE,
    MANUAL_INGESTION_SOURCE,
    RUNNING,
    SUCCESS,
} from '../utils';

const StatusContainer = styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
`;

const StatusButton = styled(Button)`
    padding: 0;
    margin: 0;
`;

export function TimeColumn(time: string, t: TFunction) {
    const date = time && new Date(time);
    const localTime = date && `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
    return <Typography.Text>{localTime || t('common.none')}</Typography.Text>;
}

interface StatusColumnProps {
    status: string;
    record: any;
    setFocusExecutionUrn: (urn: string) => void;
}

export function StatusColumn({ status, record, setFocusExecutionUrn }: StatusColumnProps) {
    const { t } = useTranslation();
    const Icon = getExecutionRequestStatusIcon(status);
    const text = getExecutionRequestStatusDisplayText(status);
    const color = getExecutionRequestStatusDisplayColor(status);
    return (
        <StatusContainer>
            {Icon && <Icon style={{ color, fontSize: 14 }} />}
            <StatusButton type="link" onClick={() => setFocusExecutionUrn(record.urn)}>
                <Typography.Text strong style={{ color, marginLeft: 8 }}>
                    {t(text) || `${t('common.pending')}...`}
                </Typography.Text>
            </StatusButton>
        </StatusContainer>
    );
}

export function SourceColumn(source: string, t: TFunction) {
    return (
        (source === MANUAL_INGESTION_SOURCE && t('ingest.manualExecution')) ||
        (source === SCHEDULED_INGESTION_SOURCE && t('ingest.scheduledExecution')) ||
        (source === CLI_INGESTION_SOURCE && t('ingest.cliExecution')) ||
        t('common.na')
    );
}

interface ButtonsColumnProps {
    record: any;
    handleViewDetails: (urn: string) => void;
    handleCancelExecution: (urn: string) => void;
    handleRollbackExecution: (runId: string) => void;
}

export function ButtonsColumn({
    record,
    handleViewDetails,
    handleCancelExecution,
    handleRollbackExecution,
}: ButtonsColumnProps) {
    const { t } = useTranslation();
    return (
        <div style={{ display: 'flex', justifyContent: 'right' }}>
            {record.urn && navigator.clipboard && (
                <Tooltip title={t('ingest.copyExecutionRequestURN')}>
                    <Button
                        style={{ marginRight: 16 }}
                        icon={<CopyOutlined />}
                        onClick={() => {
                            navigator.clipboard.writeText(record.urn);
                        }}
                    />
                </Tooltip>
            )}
            {record.duration && (
                <Button style={{ marginRight: 16 }} onClick={() => handleViewDetails(record.urn)}>
                    {t('common.details').toUpperCase()}
                </Button>
            )}
            {record.status === RUNNING && (
                <Button style={{ marginRight: 16 }} onClick={() => handleCancelExecution(record.urn)}>
                    {t('common.cancel').toUpperCase()}
                </Button>
            )}
            {record.status === SUCCESS && record.showRollback && (
                <Button style={{ marginRight: 16 }} onClick={() => handleRollbackExecution(record.id)}>
                    {t('common.rollback').toUpperCase()}
                </Button>
            )}
        </div>
    );
}
