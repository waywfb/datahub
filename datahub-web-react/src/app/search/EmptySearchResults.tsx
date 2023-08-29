import { RocketOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import { Button } from 'antd';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { ANTD_GRAY_V2 } from '../entity/shared/constants';
import { navigateToSearchUrl } from './utils/navigateToSearchUrl';
import analytics, { EventType } from '../analytics';
import { SuggestedText } from './suggestions/SearchQuerySugggester';
import useGetSearchQueryInputs from './useGetSearchQueryInputs';
import { FacetFilterInput, SearchSuggestion } from '../../types.generated';
import { useUserContext } from '../context/useUserContext';
import { Trans, useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

const NoDataContainer = styled.div`
    margin: 40px auto;
    font-size: 16px;
    color: ${ANTD_GRAY_V2[8]};
`;

const Section = styled.div`
    margin-bottom: 16px;
`;

function getRefineSearchText(filters: FacetFilterInput[], viewUrn?: string | null, t: TFunction) {
    let text = '';
    if (filters.length && viewUrn) {
        text = t('search.tryOptionFilterAndViewUrn');
    } else if (filters.length) {
        text = t('search.tryOptionFilter');
    } else if (viewUrn) {
        text = t('search.tryOptionViewUrn');
    }

    return text;
}

interface Props {
    suggestions: SearchSuggestion[];
}

export default function EmptySearchResults({ suggestions }: Props) {
    const { query, filters, viewUrn } = useGetSearchQueryInputs();
    const history = useHistory();
    const userContext = useUserContext();
    const { t } = useTranslation();
    const suggestText = suggestions.length > 0 ? suggestions[0].text : '';
    const refineSearchText = getRefineSearchText(filters, viewUrn, t);

    const onClickExploreAll = useCallback(() => {
        analytics.event({ type: EventType.SearchResultsExploreAllClickEvent });
        navigateToSearchUrl({ query: '*', history });
    }, [history]);

    const searchForSuggestion = () => {
        navigateToSearchUrl({ query: suggestText, history });
    };

    const clearFiltersAndView = () => {
        navigateToSearchUrl({ query, history });
        userContext.updateLocalState({
            ...userContext.localState,
            selectedViewUrn: undefined,
        });
    };

    return (
        <NoDataContainer>
            <Section>{t('search.noResultsFoundFor', { name: query })}</Section>
            {refineSearchText && (
                <>
                    <Trans
                        {...{
                            i18nKey: 'search.try_component',
                            values: {
                                refineSearchText,
                            },
                            components: { suggest: <SuggestedText onClick={clearFiltersAndView} /> },
                        }}
                    />
                    {suggestText && <Trans
                        {...{
                            i18nKey: 'search.orSearchingFor_component',
                            values: {
                                suggestText,
                            },
                            components: { suggest: <SuggestedText onClick={searchForSuggestion} /> },
                        }}
                    />}
                </>
            )}
            {!refineSearchText && suggestText && <Trans
                {...{
                    i18nKey: 'search.didYouMean_component',
                    values: {
                        suggestText,
                    },
                    components: { suggest: <SuggestedText onClick={searchForSuggestion} /> },
                }}
            />}
            {!refineSearchText && !suggestText && (
                <Button onClick={onClickExploreAll}>
                    <RocketOutlined /> {t('search.exploreAll')}
                </Button>
            )}
        </NoDataContainer>
    );
}
