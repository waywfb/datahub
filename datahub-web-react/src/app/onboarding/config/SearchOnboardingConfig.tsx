import React from 'react';
import { Typography } from 'antd';
import { Trans } from 'react-i18next';
import { OnboardingStep } from '../OnboardingStep';

export const SEARCH_RESULTS_FILTERS_ID = 'search-results-filters';
export const SEARCH_RESULTS_ADVANCED_SEARCH_ID = 'search-results-advanced-search';
export const SEARCH_RESULTS_BROWSE_SIDEBAR_ID = 'search-results-browse-sidebar';
export const SEARCH_RESULTS_FILTERS_V2_INTRO = 'search-results-filters-v2-intro';

export const SearchOnboardingConfig: OnboardingStep[] = [
    {
        id: SEARCH_RESULTS_FILTERS_ID,
        selector: `#${SEARCH_RESULTS_FILTERS_ID}`,
        title: 'onBoarding.search.searchResultFilterTitle',
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.search.searchResultFilter_component',
                        components: {
                            bold: <strong />,
                        },
                    }}
                />
            </Typography.Paragraph>
        ),
    },
    {
        id: SEARCH_RESULTS_ADVANCED_SEARCH_ID,
        selector: `#${SEARCH_RESULTS_ADVANCED_SEARCH_ID}`,
        title: 'onBoarding.search.searchResultAdvancedSearchTitle',
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.search.searchResultAdvancedSearch_component',
                        components: {
                            bold: <strong />,
                        },
                    }}
                />
            </Typography.Paragraph>
        ),
    },
    {
        id: SEARCH_RESULTS_BROWSE_SIDEBAR_ID,
        selector: `#${SEARCH_RESULTS_BROWSE_SIDEBAR_ID}`,
        title: 'onBoarding.search.searchResultBrowseTitle',
        style: { minWidth: '425px' },
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.search.searchResultBrowse_component',
                    }}
                />
            </Typography.Paragraph>
        ),
    },
    {
        id: SEARCH_RESULTS_FILTERS_V2_INTRO,
        prerequisiteStepId: SEARCH_RESULTS_FILTERS_ID,
        selector: `#${SEARCH_RESULTS_FILTERS_V2_INTRO}`,
        title: 'onBoarding.search.searchResultFilterV2Title',
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.search.searchResultFilterV2_component',
                    }}
                />
            </Typography.Paragraph>
        ),
    },
];
