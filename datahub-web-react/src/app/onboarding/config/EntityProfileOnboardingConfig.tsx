import React from 'react';
import { Typography } from 'antd';
import { Trans } from 'react-i18next';
import { OnboardingStep } from '../OnboardingStep';

// Entity profile tabs. Note that the 'rc-tab' prefix for the ID is added by the antd library and may change in the future.
export const ENTITY_PROFILE_ENTITIES_ID = 'entity-profile-entities';
export const ENTITY_PROFILE_PROPERTIES_ID = 'entity-profile-properties';
export const ENTITY_PROFILE_DOCUMENTATION_ID = 'entity-profile-documentation';
export const ENTITY_PROFILE_LINEAGE_ID = 'entity-profile-lineage';
export const ENTITY_PROFILE_SCHEMA_ID = 'entity-profile-schema';

// Entity profile sidebar
export const ENTITY_PROFILE_OWNERS_ID = 'entity-profile-owners';
export const ENTITY_PROFILE_TAGS_ID = 'entity-profile-tags';
export const ENTITY_PROFILE_GLOSSARY_TERMS_ID = 'entity-profile-glossary-terms';
export const ENTITY_PROFILE_DOMAINS_ID = 'entity-profile-domains';

export const EntityProfileOnboardingConfig: OnboardingStep[] = [
    {
        id: ENTITY_PROFILE_ENTITIES_ID,
        selector: `[id^='rc-tabs'][id$='Entities']`,
        title: 'onBoarding.entityProfile.entitiesTitle',
        content: (
            <Typography.Paragraph>
                <p>
                    <Trans
                        {...{
                            i18nKey: 'onBoarding.entityProfile.entities_component',
                            components: {
                                bold: <strong />,
                            },
                        }}
                    />
                </p>
            </Typography.Paragraph>
        ),
    },
    {
        id: ENTITY_PROFILE_PROPERTIES_ID,
        selector: `[id^='rc-tabs'][id$='Properties']`,
        title: 'onBoarding.entityProfile.propertiesTitle',
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.entityProfile.properties_component',
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
        id: ENTITY_PROFILE_DOCUMENTATION_ID,
        selector: `[id^='rc-tabs'][id$='Documentation']`,
        title: 'onBoarding.entityProfile.documentationTitle',
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.entityProfile.documentation_component',
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
        id: ENTITY_PROFILE_LINEAGE_ID,
        selector: `[id^='rc-tabs'][id$='Lineage']`,
        title: 'onBoarding.entityProfile.lineageTitle',
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.entityProfile.lineage_component',
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
        id: ENTITY_PROFILE_SCHEMA_ID,
        selector: `[id^='rc-tabs'][id$='Schema']`,
        title: 'onBoarding.entityProfile.schemaTitle',
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.entityProfile.schema_component',
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
        id: ENTITY_PROFILE_OWNERS_ID,
        selector: `#${ENTITY_PROFILE_OWNERS_ID}`,
        title: 'common.owners',
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.entityProfile.owners_component',
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
        id: ENTITY_PROFILE_TAGS_ID,
        selector: `#${ENTITY_PROFILE_TAGS_ID}`,
        title: 'common.tags',
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.entityProfile.tags_component',
                        components: {
                            paraph: <p />,
                            bold: <strong />,
                            aLink: (
                                // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
                                <a
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    href="https://datahubproject.io/docs/tags"
                                />
                            ),
                        },
                    }}
                />
            </Typography.Paragraph>
        ),
    },
    {
        id: ENTITY_PROFILE_GLOSSARY_TERMS_ID,
        selector: `#${ENTITY_PROFILE_GLOSSARY_TERMS_ID}`,
        title: 'common.glossaryTerms',
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.entityProfile.glossaryTerm_component',
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
    {
        id: ENTITY_PROFILE_DOMAINS_ID,
        selector: `#${ENTITY_PROFILE_DOMAINS_ID}`,
        title: 'common.domain',
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.entityProfile.domains_component',
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
];
