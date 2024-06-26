import React from 'react';
import styled from 'styled-components';
import { Popover, Tooltip } from 'antd';
import { ClockCircleOutlined, EyeOutlined, TeamOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { formatNumberWithoutAbbreviation } from '../../../shared/formatNumber';
import { ANTD_GRAY } from '../../shared/constants';
import { toLocalDateTimeString, toRelativeTimeString } from '../../../shared/time/timeUtils';
import { StatsSummary } from '../../shared/components/styled/StatsSummary';
import { countFormatter, needsFormatting } from '../../../../utils/formatter';
import ExpandingStat from '../../dataset/shared/ExpandingStat';

const StatText = styled.span`
    color: ${ANTD_GRAY[8]};
`;

const HelpIcon = styled(QuestionCircleOutlined)`
    color: ${ANTD_GRAY[7]};
    padding-left: 4px;
`;

type Props = {
    chartCount?: number | null;
    viewCount?: number | null;
    uniqueUserCountLast30Days?: number | null;
    lastUpdatedMs?: number | null;
    createdMs?: number | null;
};

export const DashboardStatsSummary = ({
    chartCount,
    viewCount,
    uniqueUserCountLast30Days,
    lastUpdatedMs,
    createdMs,
}: Props) => {
    const { t, i18n } = useTranslation();
    const statsViews = [
        (!!chartCount && (
            <ExpandingStat
                disabled={!needsFormatting(chartCount)}
                render={(isExpanded) => (
                    <StatText color={ANTD_GRAY[8]}>
                        <b>{isExpanded ? formatNumberWithoutAbbreviation(chartCount) : countFormatter(chartCount)}</b>{' '}
                        {t('common.charts').toLowerCase()}
                    </StatText>
                )}
            />
        )) ||
            undefined,
        (!!viewCount && (
            <StatText>
                <EyeOutlined style={{ marginRight: 8, color: ANTD_GRAY[7] }} />
                <b>{formatNumberWithoutAbbreviation(viewCount)}</b> {t('common.views').toLowerCase()}
            </StatText>
        )) ||
            undefined,
        (!!uniqueUserCountLast30Days && (
            <StatText>
                <TeamOutlined style={{ marginRight: 8, color: ANTD_GRAY[7] }} />
                <b>{formatNumberWithoutAbbreviation(uniqueUserCountLast30Days)}</b> {t('common.uniqueUsers')}
            </StatText>
        )) ||
            undefined,
        (!!lastUpdatedMs && (
            <Popover
                content={
                    <>
                        {createdMs && <div>Created on {toLocalDateTimeString(createdMs, i18n.language)}.</div>}
                        <div>
                            Changed on {toLocalDateTimeString(lastUpdatedMs, i18n.language)}.{' '}
                            <Tooltip title={t('dashboard.lastChangedTimeInSource')}>
                                <HelpIcon />
                            </Tooltip>
                        </div>
                    </>
                }
            >
                <StatText>
                    <ClockCircleOutlined style={{ marginRight: 8, color: ANTD_GRAY[7] }} />
                    {t('common.changed')} {toRelativeTimeString(lastUpdatedMs, i18n.language)}
                </StatText>
            </Popover>
        )) ||
            undefined,
    ].filter((stat) => stat !== undefined);

    return <>{statsViews.length > 0 && <StatsSummary stats={statsViews} />}</>;
};
