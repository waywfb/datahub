import React from 'react';
import { Typography } from 'antd';
import { Trans } from 'react-i18next';
import { OnboardingStep } from '../OnboardingStep';

export const LINEAGE_GRAPH_INTRO_ID = 'lineage-graph-intro';
export const LINEAGE_GRAPH_TIME_FILTER_ID = 'lineage-graph-time-filter';

export const LineageGraphOnboardingConfig: OnboardingStep[] = [
    {
        id: LINEAGE_GRAPH_INTRO_ID,
        title: 'onBoarding.lineageGraph.introLineageGraphTitle',
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.lineageGraph.introLineageGraph_component',
                        components: {
                            paraph: <p />,
                            bold: <strong />,
                            aLink: (
                                // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
                                <a
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    href="https://datahubproject.io/docs/lineage/lineage-feature-guide/"
                                />
                            ),
                        },
                    }}
                />
            </Typography.Paragraph>
        ),
    },
    {
        id: LINEAGE_GRAPH_TIME_FILTER_ID,
        selector: `#${LINEAGE_GRAPH_TIME_FILTER_ID}`,
        title: 'onBoarding.lineageGraph.timeFilterTitle',
        content: (
            <Typography.Paragraph>
                <p>
                    <Trans
                        {...{
                            i18nKey: 'onBoarding.lineageGraph.timeFilter_component',
                        }}
                    />
                </p>
            </Typography.Paragraph>
        ),
    },
];
