import { AccessTokenDuration, AccessTokenType } from '../../types.generated';
import {useTranslation} from "react-i18next";
import i18next from "i18next";

/** A type of DataHub Access Token. */
export const ACCESS_TOKEN_TYPES = [{ key: 'token.personal', type: AccessTokenType.Personal }];

/** The duration for which an Access Token is valid. */
export const ACCESS_TOKEN_DURATIONS = [
    { keyParam: {key:'duration.hour',  params: {count: 1} }, text: `${i18next.t('duration.hour', { count: 1 })}`, duration: AccessTokenDuration.OneHour },
    { text: `${i18next.t('duration.day', { count: 1 })}`, duration: AccessTokenDuration.OneDay },
    { text: `${i18next.t('duration.month', { count: 1 })}`, duration: AccessTokenDuration.OneMonth },
    { text: `${i18next.t('duration.month', { count: 3 })}`, duration: AccessTokenDuration.ThreeMonths },
    { text: i18next.t('never'), duration: AccessTokenDuration.NoExpiry },
];

const addHours = (hour: number) => {
    const {t} = useTranslation();
    const result = new Date();
    result.setHours(result.getHours() + hour);
    return t('token.tokenWillExpireOnAt', { date: result.toLocaleDateString(), time: result.toLocaleTimeString() });
};

const addDays = (days: number) => {
    const {t} = useTranslation();
    const result = new Date();
    result.setDate(result.getDate() + days);
    return t('token.tokenWillExpireOnAt', { date: result.toLocaleDateString(), time: result.toLocaleTimeString() });
};

export const getTokenExpireDate = (duration: AccessTokenDuration) => {
    const {t} = useTranslation();
    switch (duration) {
        case AccessTokenDuration.OneHour:
            return addHours(1);
        case AccessTokenDuration.OneDay:
            return addDays(1);
        case AccessTokenDuration.OneMonth:
            return addDays(30);
        case AccessTokenDuration.ThreeMonths:
            return addDays(90);
        case AccessTokenDuration.NoExpiry:
            return t('token.tokenWillNeverExpire');
        default:
            return AccessTokenDuration.OneMonth;
    }
};
