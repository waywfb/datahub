import React from 'react';
import { Image, Typography } from 'antd';
import { Trans } from 'react-i18next';
import { OnboardingStep } from '../OnboardingStep';
import { ANTD_GRAY } from '../../entity/shared/constants';

export const GLOBAL_WELCOME_TO_DATAHUB_ID = 'global-welcome-to-datahub';
export const HOME_PAGE_INGESTION_ID = 'home-page-ingestion';
export const HOME_PAGE_DOMAINS_ID = 'home-page-domains';
export const HOME_PAGE_PLATFORMS_ID = 'home-page-platforms';
export const HOME_PAGE_MOST_POPULAR_ID = 'home-page-most-popular';
export const HOME_PAGE_SEARCH_BAR_ID = 'home-page-search-bar';

export const HomePageOnboardingConfig: OnboardingStep[] = [
    {
        id: GLOBAL_WELCOME_TO_DATAHUB_ID,
        content: (
            <div>
                <Image
                    preview={false}
                    height={184}
                    width={500}
                    style={{ marginLeft: '50px' }}
                    src="https://datahubproject.io/assets/ideal-img/datahub-flow-diagram-light.5ce651b.1600.png"
                />
                <Typography.Title level={3}>
                    <Trans
                        {...{
                            i18nKey: 'onBoarding.homePage.welcomeTitle',
                        }}
                    />
                </Typography.Title>
                <Typography.Paragraph style={{ lineHeight: '22px' }}>
                    <Trans
                        {...{
                            i18nKey: 'onBoarding.homePage.welcomeParaph.intro_component',
                            components: {
                                bold: <strong />,
                            },
                        }}
                    />
                </Typography.Paragraph>
                <Typography.Paragraph style={{ lineHeight: '24px' }}>
                    <ul>
                        <li>
                            <Trans
                                {...{
                                    i18nKey: 'onBoarding.homePage.welcomeParaph.listFeatures.quicklySearch_component',
                                    components: {
                                        bold: <strong />,
                                    },
                                }}
                            />
                        </li>
                        <li>
                            <Trans
                                {...{
                                    i18nKey:
                                        'onBoarding.homePage.welcomeParaph.listFeatures.viewAndUnderstand_component',
                                    components: {
                                        bold: <strong />,
                                    },
                                }}
                            />
                        </li>
                        <li>
                            <Trans
                                {...{
                                    i18nKey: 'onBoarding.homePage.welcomeParaph.listFeatures.gainInsight_component',
                                    components: {
                                        bold: <strong />,
                                    },
                                }}
                            />
                        </li>
                        <li>
                            <Trans
                                {...{
                                    i18nKey: 'onBoarding.homePage.welcomeParaph.listFeatures.defineOwnership_component',
                                    components: {
                                        bold: <strong />,
                                    },
                                }}
                            />
                        </li>
                    </ul>
                    <p>
                        <Trans
                            {...{
                                i18nKey: 'onBoarding.homePage.welcomeParaph.getStarted_component',
                            }}
                        />
                    </p>
                    <div
                        style={{
                            backgroundColor: ANTD_GRAY[4],
                            opacity: '0.7',
                            borderRadius: '4px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <span style={{ paddingLeft: '5px' }}>💡</span>
                        <span style={{ paddingLeft: '10px' }}>
                            <Trans
                                {...{
                                    i18nKey: 'onBoarding.homePage.welcomeParaph.pressKey_component',
                                    components: {
                                        bold: <strong />,
                                    },
                                }}
                            />
                        </span>
                    </div>
                </Typography.Paragraph>
            </div>
        ),
        style: { minWidth: '650px' },
    },
    {
        id: HOME_PAGE_INGESTION_ID,
        selector: `#${HOME_PAGE_INGESTION_ID}`,
        title: 'onBoarding.homePage.ingestionTitle',
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.homePage.ingestion_component',
                        components: {
                            bold: <strong />,
                        },
                    }}
                />
            </Typography.Paragraph>
        ),
    },
    {
        id: HOME_PAGE_DOMAINS_ID,
        selector: `#${HOME_PAGE_DOMAINS_ID}`,
        title: 'onBoarding.homePage.domainsTitle',
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.homePage.domains_component',
                        components: {
                            bold: <strong />,
                        },
                    }}
                />
            </Typography.Paragraph>
        ),
    },
    {
        id: HOME_PAGE_PLATFORMS_ID,
        selector: `#${HOME_PAGE_PLATFORMS_ID}`,
        title: 'onBoarding.homePage.platformsTitle',
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.homePage.platforms_component',
                        components: {
                            bold: <strong />,
                        },
                    }}
                />
            </Typography.Paragraph>
        ),
    },
    {
        id: HOME_PAGE_MOST_POPULAR_ID,
        selector: `#${HOME_PAGE_MOST_POPULAR_ID}`,
        title: 'onBoarding.homePage.mostPopularTitle',
        content: (
            <Trans
                {...{
                    i18nKey: 'onBoarding.homePage.mostPopular_component',
                }}
            />
        ),
    },
    {
        id: HOME_PAGE_SEARCH_BAR_ID,
        selector: `#${HOME_PAGE_SEARCH_BAR_ID}`,
        title: 'onBoarding.homePage.searchBarTitle',
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.homePage.searchBar_component',
                        components: {
                            paraph: <p />,
                            bold: <strong />,
                        },
                    }}
                />
            </Typography.Paragraph>
        ),
    },
];
