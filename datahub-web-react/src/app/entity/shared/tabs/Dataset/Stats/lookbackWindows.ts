import { DateInterval } from '../../../../../../types.generated';

/**
 * Change this to add or modify the lookback windows that are selectable via the UI.
 */
export const LOOKBACK_WINDOWS = {
    DAY: { translateKey: 'duration.day', value: '1 day', windowSize: { interval: DateInterval.Day, count: 1 } },
    WEEK: { translateKey: 'duration.week', value: '1 week', windowSize: { interval: DateInterval.Week, count: 1 } },
    MONTH: { translateKey: 'duration.month', value: '1 month', windowSize: { interval: DateInterval.Month, count: 1 } },
    QUARTER: { translateKey: 'duration.month', value: '3 months', windowSize: { interval: DateInterval.Month, count: 3 } },
    YEAR: { translateKey: 'duration.year', value: '1 year', windowSize: { interval: DateInterval.Year, count: 1 } },
};

export type LookbackWindow = {
    translateKey: string;
    value: string;
    windowSize: {
        interval: DateInterval;
        count: number;
    };
};
