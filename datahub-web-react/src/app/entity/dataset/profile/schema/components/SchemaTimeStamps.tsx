import { ClockCircleOutlined } from '@ant-design/icons';
import { Popover, Typography } from 'antd';
import React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { toLocalDateTimeString, toRelativeTimeString } from '../../../../../shared/time/timeUtils';
import { ANTD_GRAY } from '../../../../shared/constants';

const CurrentVersionTimestampText = styled(Typography.Text)`
    &&& {
        line-height: 22px;
        margin-top: 10px;
        margin-right: 10px;
        color: ${ANTD_GRAY[7]};
        width: max-content;
    }
`;

const TimeStampWrapper = styled.div`
    margin-bottom: 5px;
`;

const StyledClockIcon = styled(ClockCircleOutlined)`
    margin-right: 5px;
`;

interface Props {
    lastUpdated?: number | null;
    lastObserved?: number | null;
}

function SchemaTimeStamps(props: Props) {
    const { t, i18n } = useTranslation();
    const { lastUpdated, lastObserved } = props;

    if (!lastUpdated && !lastObserved) return null;

    return (
        <Popover
            content={
                <>
                    {lastObserved && (
                        <TimeStampWrapper>
                            {t('reporting.lastObservedOnDate', {
                                date: toLocalDateTimeString(lastObserved, i18n.language),
                            })}
                        </TimeStampWrapper>
                    )}
                    {lastUpdated && (
                        <div>
                            {t('reporting.firstReportedOn', {
                                date: toLocalDateTimeString(lastUpdated, i18n.language),
                            })}
                        </div>
                    )}
                </>
            }
        >
            <CurrentVersionTimestampText>
                {lastObserved && (
                    <span>
                        <StyledClockIcon />{' '}
                        {t('reporting.lastObservedDate', { date: toRelativeTimeString(lastObserved, i18n.language) })}
                    </span>
                )}
                {!lastObserved && lastUpdated && (
                    <span>
                        <StyledClockIcon />
                        {t('reporting.reportedWithDate', { date: toRelativeTimeString(lastUpdated, i18n.language) })}
                    </span>
                )}
            </CurrentVersionTimestampText>
        </Popover>
    );
}

export default SchemaTimeStamps;
