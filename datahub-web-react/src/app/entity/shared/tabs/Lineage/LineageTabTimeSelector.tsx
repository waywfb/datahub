import React from 'react';
import moment from 'moment';
import { useHistory, useLocation } from 'react-router';
import analytics, { EventType } from '../../../../analytics';
import LineageTimeSelector from '../../../../lineage/LineageTimeSelector';
import { getTimeFromNow } from '../../../../shared/time/timeUtils';
import updateQueryParams from '../../../../shared/updateQueryParams';
import { useGetLineageTimeParams } from '../../../../lineage/utils/useGetLineageTimeParams';
import { useTranslation } from 'react-i18next';

export default function LineageTabTimeSelector() {
    const history = useHistory();
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const { startTimeMillis, endTimeMillis } = useGetLineageTimeParams();

    const lineageTimeSelectorOnChange = (dates, _dateStrings) => {
        if (dates) {
            const [start, end] = dates;
            const startTimeMillisValue = start?.valueOf();
            const endTimeMillisValue = end?.valueOf();
            const relativeStartDate = getTimeFromNow(startTimeMillisValue, t, i18n.language);
            const relativeEndDate = getTimeFromNow(endTimeMillisValue, t, i18n.language);
            analytics.event({
                type: EventType.LineageGraphTimeRangeSelectionEvent,
                relativeStartDate,
                relativeEndDate,
            });

            updateQueryParams(
                { start_time_millis: startTimeMillisValue, end_time_millis: endTimeMillisValue },
                location,
                history,
            );
        }
    };

    const initialDates: [moment.Moment | null, moment.Moment | null] = [
        startTimeMillis ? moment(startTimeMillis) : null,
        endTimeMillis ? moment(endTimeMillis) : null,
    ];

    return <LineageTimeSelector onChange={lineageTimeSelectorOnChange} initialDates={initialDates} />;
}
