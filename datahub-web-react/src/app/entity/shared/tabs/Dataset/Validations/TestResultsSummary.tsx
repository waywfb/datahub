import { CheckCircleFilled, CloseCircleFilled, StopOutlined } from '@ant-design/icons';
import { Tooltip, Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { ANTD_GRAY } from '../../../constants';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

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

export type TestsSummary = {
    failing: number;
    passing: number;
    total: number;
};

type Props = {
    summary: TestsSummary;
};

const SUCCESS_COLOR_HEX = '#52C41A';
const FAILURE_COLOR_HEX = '#F5222D';

const getSummaryIcon = (summary: TestsSummary) => {
    if (summary.total === 0) {
        return <StopOutlined style={{ color: ANTD_GRAY[6], fontSize: 28 }} />;
    }
    if (summary.passing === summary.total) {
        return <CheckCircleFilled style={{ color: SUCCESS_COLOR_HEX, fontSize: 28 }} />;
    }
    return <CloseCircleFilled style={{ color: FAILURE_COLOR_HEX, fontSize: 28 }} />;
};

const getSummaryMessage = (summary: TestsSummary, t: TFunction) => {
    if (summary.total === 0) {
        return t('test.noTestHaveRun');
    }
    if (summary.passing === summary.total) {
        return t('test.allPassing');
    }
    if (summary.failing === summary.total) {
        return t('test.allFailing');
    }
    return t('test.someFailing');
};

export const TestResultsSummary = ({ summary }: Props) => {
    const { t } = useTranslation();
    const summaryIcon = getSummaryIcon(summary);
    const summaryMessage = getSummaryMessage(summary, t);
    const subtitleMessage = t('test.testResume', { passingCount: summary.passing, failingCount: summary.failing });
    return (
        <SummaryHeader>
            <SummaryContainer>
                <Tooltip title={t('test.testStatusTooltip')}>
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
