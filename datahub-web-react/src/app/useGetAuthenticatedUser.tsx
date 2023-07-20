import Cookies from 'js-cookie';
import {CLIENT_AUTH_COOKIE} from '../conf/Global';
import {useGetMeQuery} from '../graphql/me.generated';
import {useTranslation} from "react-i18next";

/**
 * Fetch a CorpUser object corresponding to the currently authenticated user.
 */
export function useGetAuthenticatedUser(skip?: boolean) {
    const userUrn = Cookies.get(CLIENT_AUTH_COOKIE);
    const {t} = useTranslation();
    const {data, error} = useGetMeQuery({skip: skip || !userUrn, fetchPolicy: 'cache-and-network'});
    if (error) {
        console.error(`${t('user.error.fetchFromCache')} + ${error.message}`);
    }
    return data?.me;

}

/**
 * Fetch an urn corresponding to the authenticated user.
 */
export function useGetAuthenticatedUserUrn() {
    const userUrn = Cookies.get(CLIENT_AUTH_COOKIE);
    const {t} = useTranslation();
    if (!userUrn) {
        throw new Error(t('user.error.notFound'));
    }
    return userUrn;
}