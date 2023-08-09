import { blue } from '@ant-design/colors';
import { CodeOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Image, Tooltip, Typography } from 'antd';
import cronstrue from 'cronstrue';
import React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { ANTD_GRAY } from '../../entity/shared/constants';
import { capitalizeFirstLetter } from '../../shared/textUtil';
import useGetSourceLogoUrl from './builder/useGetSourceLogoUrl';
import {
    getExecutionRequestStatusDisplayColor,
    getExecutionRequestStatusDisplayText,
    getExecutionRequestStatusIcon,
    RUNNING,
} from './utils';

const PreviewImage = styled(Image)`
    max-height: 28px;
    width: auto;
    object-fit: contain;
    margin: 0px;
    background-color: transparent;
`;

const StatusContainer = styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
`;

const StatusButton = styled(Button)`
    padding: 0px;
    margin: 0px;
`;

const ActionButtonContainer = styled.div`
    display: flex;
    justify-content: right;
`;

const TypeWrapper = styled.div`
    align-items: center;
    display: flex;
`;

const CliBadge = styled.span`
    margin-left: 20px;
    border-radius: 15px;
    border: 1px solid ${ANTD_GRAY[8]};
    padding: 1px 4px;
    font-size: 10px;

    font-size: 8px;
    font-weight: bold;
    letter-spacing: 0.5px;
    border: 1px solid ${blue[6]};
    color: ${blue[6]};

    svg {
        display: none;
        margin-right: 5px;
    }
`;
interface TypeColumnProps {
    type: string;
    record: any;
}

export function TypeColumn({ type, record }: TypeColumnProps) {
    const { t } = useTranslation();
    const iconUrl = useGetSourceLogoUrl(type);
    const typeDisplayName = capitalizeFirstLetter(type);

    return (
        <TypeWrapper>
            {iconUrl ? (
                <Tooltip overlay={typeDisplayName}>
                    <PreviewImage preview={false} src={iconUrl} alt={type || ''} />
                </Tooltip>
            ) : (
                <Typography.Text strong>{typeDisplayName}</Typography.Text>
            )}
            {record.cliIngestion && (
                <Tooltip title={t('ingest.ingestionSourceIngestedFromCLI')}>
                    <CliBadge>
                        <CodeOutlined />
                        {t('ingest.cli')}
                    </CliBadge>
                </Tooltip>
            )}
        </TypeWrapper>
    );
}

export function LastExecutionColumn(time: any) {
    const { t } = useTranslation();
    const executionDate = time && new Date(time);
    const localTime = executionDate && `${executionDate.toLocaleDateString()} at ${executionDate.toLocaleTimeString()}`;
    return <Typography.Text>{localTime || t('common.none')}</Typography.Text>;
}

export function ScheduleColumn(schedule: any, record: any) {
    const { t } = useTranslation();
    const tooltip =
        schedule && `${t('common.runs')} ${cronstrue.toString(schedule).toLowerCase()} (${record.timezone})`;
    return (
        <Tooltip title={tooltip || t('common.notScheduled')}>
            <Typography.Text code>{schedule || t('common.none')}</Typography.Text>
        </Tooltip>
    );
}

interface LastStatusProps {
    status: any;
    record: any;
    setFocusExecutionUrn: (urn: string) => void;
}

export function LastStatusColumn({ status, record, setFocusExecutionUrn }: LastStatusProps) {
    const { t } = useTranslation();
    const Icon = getExecutionRequestStatusIcon(status);
    const text = getExecutionRequestStatusDisplayText(status);
    const color = getExecutionRequestStatusDisplayColor(status);
    return (
        <StatusContainer>
            {Icon && <Icon style={{ color, fontSize: 14 }} />}
            <StatusButton type="link" onClick={() => setFocusExecutionUrn(record.lastExecUrn)}>
                <Typography.Text strong style={{ color, marginLeft: 8 }}>
                    {t(text) || `${t('common.pending')}...`}
                </Typography.Text>
            </StatusButton>
        </StatusContainer>
    );
}

interface ActionsColumnProps {
    record: any;
    setFocusExecutionUrn: (urn: string) => void;
    onExecute: (urn: string) => void;
    onEdit: (urn: string) => void;
    onView: (urn: string) => void;
    onDelete: (urn: string) => void;
}

export function ActionsColumn({
    record,
    onEdit,
    setFocusExecutionUrn,
    onView,
    onExecute,
    onDelete,
}: ActionsColumnProps) {
    const { t } = useTranslation();
    return (
        <ActionButtonContainer>
            {navigator.clipboard && (
                <Tooltip title={t('ingest.copyIngestionSourceURNTitle')}>
                    <Button
                        style={{ marginRight: 16 }}
                        icon={<CopyOutlined />}
                        onClick={() => {
                            navigator.clipboard.writeText(record.urn);
                        }}
                    />
                </Tooltip>
            )}
            {!record.cliIngestion && (
                <Button style={{ marginRight: 16 }} onClick={() => onEdit(record.urn)}>
                    {t('common.edit').toUpperCase()}
                </Button>
            )}
            {record.cliIngestion && (
                <Button style={{ marginRight: 16 }} onClick={() => onView(record.urn)}>
                    {t('common.view').toUpperCase()}
                </Button>
            )}
            {record.lastExecStatus !== RUNNING && (
                <Button
                    disabled={record.cliIngestion}
                    style={{ marginRight: 16 }}
                    onClick={() => onExecute(record.urn)}
                >
                    {t('common.run')}
                </Button>
            )}
            {record.lastExecStatus === RUNNING && (
                <Button style={{ marginRight: 16 }} onClick={() => setFocusExecutionUrn(record.lastExecUrn)}>
                    {t('common.details').toUpperCase()}
                </Button>
            )}
            <Button data-testid="delete-button" onClick={() => onDelete(record.urn)} type="text" shape="circle" danger>
                <DeleteOutlined />
            </Button>
        </ActionButtonContainer>
    );
}
