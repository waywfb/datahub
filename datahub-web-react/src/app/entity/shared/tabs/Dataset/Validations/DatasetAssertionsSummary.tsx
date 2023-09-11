import { CheckCircleFilled, CloseCircleFilled, StopOutlined } from '@ant-design/icons';
import { Tooltip, Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { ANTD_GRAY } from '../../../constants';

const SummaryHeader = styled.div`
    width: 100%;
    padding-left: 40px;
    padding-top: 20px;
    padding-bottom: 20px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid ${ANTD_GRAY[4.5]};
`;

const SummaryContainer = styled.div``;

const SummaryMessage = styled.div`
    display: inline-block;
    margin-left: 20px;
`;

const SummaryTitle = styled(Typography.Title)`
    && {
        padding-bottom: 0;
        margin-bottom: 0;
    }
`;

export type AssertionsSummary = {
    totalAssertions: number;
    totalRuns: number;
    failedRuns: number;
    succeededRuns: number;
};

type Props = {
    summary: AssertionsSummary;
};

const SUCCESS_COLOR_HEX = '#52C41A';
const FAILURE_COLOR_HEX = '#F5222D';

const getSummaryIcon = (summary: AssertionsSummary) => {
    if (summary.totalRuns === 0) {
        return <StopOutlined style={{ color: ANTD_GRAY[6], fontSize: 28 }} />;
    }
    if (summary.succeededRuns === summary.totalRuns) {
        return <CheckCircleFilled style={{ color: SUCCESS_COLOR_HEX, fontSize: 28 }} />;
    }
    return <CloseCircleFilled style={{ color: FAILURE_COLOR_HEX, fontSize: 28 }} />;
};

const getSummaryMessage = (summary: AssertionsSummary, t: TFunction) => {
    if (summary.totalRuns === 0) {
        return t('assertion.noAssertionsHaveRun');
    }
    if (summary.succeededRuns === summary.totalRuns) {
        return t('assertion.allPassing');
    }
    if (summary.failedRuns === summary.totalRuns) {
        return t('assertion.allFailing');
    }
    return t('assertion.someFailing');
};

export const DatasetAssertionsSummary = ({ summary }: Props) => {
    const { t } = useTranslation();
    const summaryIcon = getSummaryIcon(summary);
    const summaryMessage = getSummaryMessage(summary, t);
    const subtitleMessage = t('assertion.assertionResume', {
        successCount: summary.succeededRuns,
        failedCount: summary.failedRuns,
    });
    return (
        <SummaryHeader>
            <SummaryContainer>
                <Tooltip title={t('assertion.assertionStatusTooltip')}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {summaryIcon}
                        <SummaryMessage>
                            <SummaryTitle level={5}>{summaryMessage}</SummaryTitle>
                            <Typography.Text type="secondary">{subtitleMessage}</Typography.Text>
                        </SummaryMessage>
                    </div>
                </Tooltip>
            </SummaryContainer>
        </SummaryHeader>
    );
};
