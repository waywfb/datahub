import { DownloadOutlined } from '@ant-design/icons';
import { Button, message, Modal, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useGetIngestionExecutionRequestQuery } from '../../../../graphql/ingestion.generated';
import { ANTD_GRAY } from '../../../entity/shared/constants';
import { downloadFile } from '../../../search/utils/csvUtils';
import { Message } from '../../../shared/Message';
import IngestedAssets from '../IngestedAssets';
import {
    getExecutionRequestStatusDisplayColor,
    getExecutionRequestStatusDisplayText,
    getExecutionRequestStatusIcon,
    getExecutionRequestSummaryText,
    RUNNING,
    SUCCESS,
} from '../utils';

const StyledTitle = styled(Typography.Title)`
    padding: 0px;
    margin: 0px;
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    padding-bottom: 12px;
`;

const SectionHeader = styled(Typography.Title)`
    &&&& {
        padding: 0px;
        margin: 0px;
        margin-bottom: 12px;
    }
`;

const SectionSubHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const SubHeaderParagraph = styled(Typography.Paragraph)`
    margin-bottom: 0px;
`;

const HeaderSection = styled.div``;

const StatusSection = styled.div`
    border-bottom: 1px solid ${ANTD_GRAY[4]};
    padding: 16px;
    padding-left: 30px;
    padding-right: 30px;
`;

const ResultText = styled.div`
    margin-bottom: 4px;
`;

const IngestedAssetsSection = styled.div`
    border-bottom: 1px solid ${ANTD_GRAY[4]};
    padding: 16px;
    padding-left: 30px;
    padding-right: 30px;
`;

const LogsSection = styled.div`
    padding-top: 16px;
    padding-left: 30px;
    padding-right: 30px;
`;

const ShowMoreButton = styled(Button)`
    padding: 0px;
`;

const modalStyle = {
    top: 100,
};

const modalBodyStyle = {
    padding: 0,
};

type Props = {
    urn: string;
    visible: boolean;
    onClose: () => void;
};

export const ExecutionDetailsModal = ({ urn, visible, onClose }: Props) => {
    const { t } = useTranslation();
    const [showExpandedLogs, setShowExpandedLogs] = useState(false);
    const { data, loading, error, refetch } = useGetIngestionExecutionRequestQuery({ variables: { urn } });
    const output = data?.executionRequest?.result?.report || t('ingest.noOutputFound');

    const downloadLogs = () => {
        downloadFile(output, `exec-${urn}.log`);
    };

    const logs = (showExpandedLogs && output) || output.slice(0, 100);
    const result = data?.executionRequest?.result?.status;

    useEffect(() => {
        const interval = setInterval(() => {
            if (result === RUNNING) refetch();
        }, 2000);

        return () => clearInterval(interval);
    });

    const ResultIcon = result && getExecutionRequestStatusIcon(result);
    const resultColor = result && getExecutionRequestStatusDisplayColor(result);
    const resultText = result && (
        <Typography.Text style={{ color: resultColor, fontSize: 14 }}>
            {ResultIcon && <ResultIcon style={{ marginRight: 4 }} />}
            {t(getExecutionRequestStatusDisplayText(result))}
        </Typography.Text>
    );
    const resultSummaryText =
        (result && <Typography.Text type="secondary">{t(getExecutionRequestSummaryText(result))}</Typography.Text>) ||
        undefined;
    const isOutputExpandable = output.length > 100;

    return (
        <Modal
            width={800}
            footer={<Button onClick={onClose}>{t('common.close')}</Button>}
            style={modalStyle}
            bodyStyle={modalBodyStyle}
            title={
                <HeaderSection>
                    <StyledTitle level={4}>{t('ingest.ingestionRunDetails')}</StyledTitle>
                </HeaderSection>
            }
            visible={visible}
            onCancel={onClose}
        >
            {!data && loading && <Message type="loading" content={`${t('ingest.loadingExecutionDetails')}...`} />}
            {error && message.error(`${t('ingest.failedToLoadExecutionDetails')} :(`)}
            <Section>
                <StatusSection>
                    <Typography.Title level={5}>{t('common.status')}</Typography.Title>
                    <ResultText>{resultText}</ResultText>
                    <SubHeaderParagraph>{resultSummaryText}</SubHeaderParagraph>
                </StatusSection>
                {result === SUCCESS && (
                    <IngestedAssetsSection>
                        {data?.executionRequest?.id && <IngestedAssets id={data?.executionRequest?.id} />}
                    </IngestedAssetsSection>
                )}
                <LogsSection>
                    <SectionHeader level={5}>{t('common.logs')}</SectionHeader>
                    <SectionSubHeader>
                        <SubHeaderParagraph type="secondary">
                            {t('ingest.viewLogsThatWereCollectedDuringTheIngestionRun')}
                        </SubHeaderParagraph>
                        <Button type="text" onClick={downloadLogs}>
                            <DownloadOutlined />
                            {t('common.download')}
                        </Button>
                    </SectionSubHeader>
                    <Typography.Paragraph ellipsis>
                        <pre>{`${logs}${!showExpandedLogs && isOutputExpandable ? '...' : ''}`}</pre>
                        {isOutputExpandable && (
                            <ShowMoreButton type="link" onClick={() => setShowExpandedLogs(!showExpandedLogs)}>
                                {showExpandedLogs ? t('common.hide') : t('common.showMore')}
                            </ShowMoreButton>
                        )}
                    </Typography.Paragraph>
                </LogsSection>
            </Section>
        </Modal>
    );
};
