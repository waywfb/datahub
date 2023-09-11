import React from 'react';
import { Typography } from 'antd';
import { Trans } from 'react-i18next';
import { OnboardingStep } from '../OnboardingStep';

export const POLICIES_INTRO_ID = 'policies-intro';
export const POLICIES_CREATE_POLICY_ID = 'policies-create-policy';

export const PoliciesOnboardingConfig: OnboardingStep[] = [
    {
        id: POLICIES_INTRO_ID,
        title: 'common.policies',
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.policies.introPolicies_component',
                        components: {
                            paraph: <p />,
                            bold: <strong />,
                            aLink: (
                                // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
                                <a
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    href="https://datahubproject.io/docs/authorization/policies"
                                />
                            ),
                        },
                    }}
                />
            </Typography.Paragraph>
        ),
    },
    {
        id: POLICIES_CREATE_POLICY_ID,
        selector: `#${POLICIES_CREATE_POLICY_ID}`,
        title: 'onBoarding.policies.createPoliciesTitle',
        content: (
            <Typography.Paragraph>
                <p>
                    <Trans
                        {...{
                            i18nKey: 'onBoarding.policies.createPolicies_component',
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
