import { TFunction } from 'i18next';
import { AccessTokenDuration, AccessTokenType } from '../../types.generated';

/** A type of DataHub Access Token. */
export const ACCESS_TOKEN_TYPES = [{ key: 'token.personal', type: AccessTokenType.Personal }];

/** The duration for which an Access Token is valid. */
type AccessTokenDurationType = {
    keyParam: { key: string; params: { postProcess?: string; count?: number } };
    duration: AccessTokenDuration;
};
export const ACCESS_TOKEN_DURATIONS: AccessTokenDurationType[] = [
    {
        keyParam: { key: 'duration.hour_interval', params: { postProcess: 'interval', count: 1 } },
        duration: AccessTokenDuration.OneHour,
    },
    {
        keyParam: { key: 'duration.day_interval', params: { postProcess: 'interval', count: 1 } },
        duration: AccessTokenDuration.OneDay,
    },
    {
        keyParam: { key: 'duration.month_interval', params: { postProcess: 'interval', count: 1 } },
        duration: AccessTokenDuration.OneMonth,
    },
    {
        keyParam: { key: 'duration.month_interval', params: { postProcess: 'interval', count: 3 } },
        duration: AccessTokenDuration.ThreeMonths,
    },
    { keyParam: { key: 'never', params: {} }, duration: AccessTokenDuration.NoExpiry },
];

const addHours = (hour: number, t: TFunction) => {
    const result = new Date();
    result.setHours(result.getHours() + hour);
    return t('token.tokenWillExpireOnAt', { date: result.toLocaleDateString(), time: result.toLocaleTimeString() });
};

const addDays = (days: number, t: TFunction) => {
    const result = new Date();
    result.setDate(result.getDate() + days);
    return t('token.tokenWillExpireOnAt', { date: result.toLocaleDateString(), time: result.toLocaleTimeString() });
};

export const getTokenExpireDate = (duration: AccessTokenDuration, t: TFunction) => {
    switch (duration) {
        case AccessTokenDuration.OneHour:
            return addHours(1, t);
        case AccessTokenDuration.OneDay:
            return addDays(1, t);
        case AccessTokenDuration.OneMonth:
            return addDays(30, t);
        case AccessTokenDuration.ThreeMonths:
            return addDays(90, t);
        case AccessTokenDuration.NoExpiry:
            return t('token.tokenWillNeverExpire');
        default:
            return AccessTokenDuration.OneMonth;
    }
};
