import React from 'react';
import { Typography } from 'antd';
import { Trans } from 'react-i18next';
import { OnboardingStep } from '../OnboardingStep';

export const BUSINESS_GLOSSARY_INTRO_ID = 'business-glossary-intro';
export const BUSINESS_GLOSSARY_CREATE_TERM_ID = 'business-glossary-create-term';
export const BUSINESS_GLOSSARY_CREATE_TERM_GROUP_ID = 'business-glossary-create-term-group';

export const BusinessGlossaryOnboardingConfig: OnboardingStep[] = [
    {
        id: BUSINESS_GLOSSARY_INTRO_ID,
        title: 'onBoarding.businessGlossary.businessGlossaryIntroTitle',
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.businessGlossary.businessGlossaryIntro_component',
                        components: {
                            paraph: <p />,
                            bold: <strong />,
                        },
                    }}
                />
            </Typography.Paragraph>
        ),
    },
    {
        id: BUSINESS_GLOSSARY_CREATE_TERM_ID,
        selector: `#${BUSINESS_GLOSSARY_CREATE_TERM_ID}`,
        title: 'onBoarding.businessGlossary.businessGlossaryCreateTermTitle',
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.businessGlossary.businessGlossaryCreateTerm_component',
                        components: {
                            paraph: <p />,
                            bold: <strong />,
                        },
                    }}
                />
            </Typography.Paragraph>
        ),
    },
    {
        id: BUSINESS_GLOSSARY_CREATE_TERM_GROUP_ID,
        selector: `#${BUSINESS_GLOSSARY_CREATE_TERM_GROUP_ID}`,
        title: 'onBoarding.businessGlossary.businessGlossaryCreateTermGroupTitle',
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.businessGlossary.businessGlossaryCreateTermGroup_component',
                        components: {
                            paraph: <p />,
                            bold: <strong />,
                            aLink: (
                                // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
                                <a
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    href="https://datahubproject.io/docs/glossary/business-glossary"
                                />
                            ),
                        },
                    }}
                />
            </Typography.Paragraph>
        ),
    },
];
