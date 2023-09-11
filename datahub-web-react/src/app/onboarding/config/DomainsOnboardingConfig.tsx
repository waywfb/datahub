import React from 'react';
import { Typography } from 'antd';
import { Trans } from 'react-i18next';
import { OnboardingStep } from '../OnboardingStep';

export const DOMAINS_INTRO_ID = 'domains-intro';
export const DOMAINS_CREATE_DOMAIN_ID = 'domains-create-domain';

export const DomainsOnboardingConfig: OnboardingStep[] = [
    {
        id: DOMAINS_INTRO_ID,
        title: 'common.domains',
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.domains.domainIntro_component',
                        components: {
                            paraph: <p />,
                            bold: <strong />,
                            aLink: (
                                // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
                                <a
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    href="https://datahubproject.io/docs/domains"
                                />
                            ),
                        },
                    }}
                />
            </Typography.Paragraph>
        ),
    },
    {
        id: DOMAINS_CREATE_DOMAIN_ID,
        selector: `#${DOMAINS_CREATE_DOMAIN_ID}`,
        title: 'onBoarding.domains.createDomainTitle',
        content: (
            <Typography.Paragraph>
                <p>
                    <Trans
                        {...{
                            i18nKey: 'onBoarding.domains.createDomains_component',
                            components: {
                                bold: <strong />,
                            },
                        }}
                    />
                </p>
            </Typography.Paragraph>
        ),
    },
];
