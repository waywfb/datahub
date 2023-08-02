import React from 'react';
import { Typography } from 'antd';
import { Trans } from 'react-i18next';
import { OnboardingStep } from '../OnboardingStep';

export const INGESTION_CREATE_SOURCE_ID = 'ingestion-create-source';
export const INGESTION_REFRESH_SOURCES_ID = 'ingestion-refresh-sources';

export const IngestionOnboardingConfig: OnboardingStep[] = [
    {
        id: INGESTION_CREATE_SOURCE_ID,
        selector: `#${INGESTION_CREATE_SOURCE_ID}`,
        title: 'onBoarding.ingestion.ingestionCreateTitle',
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.ingestion.ingestionCreate_component',
                        components: {
                            paraph: <p />,
                            bold: <strong />,
                            aLink: (
                                // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
                                <a
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    href="https://datahubproject.io/docs/metadata-ingestion"
                                />
                            ),
                        },
                    }}
                />
            </Typography.Paragraph>
        ),
    },
    {
        id: INGESTION_REFRESH_SOURCES_ID,
        selector: `#${INGESTION_REFRESH_SOURCES_ID}`,
        title: 'onBoarding.ingestion.ingestionRefreshSourceTitle',
        content: (
            <Typography.Paragraph>
                <p>
                    <Trans
                        {...{
                            i18nKey: 'onBoarding.ingestion.ingestionRefreshSource_component',
                        }}
                    />
                </p>
            </Typography.Paragraph>
        ),
    },
];
