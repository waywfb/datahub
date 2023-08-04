import React from 'react';
import { Typography } from 'antd';
import { Trans } from 'react-i18next';
import { OnboardingStep } from '../OnboardingStep';

export const GROUPS_INTRO_ID = 'groups-intro';
export const GROUPS_CREATE_GROUP_ID = 'groups-create-group';

export const GroupsOnboardingConfig: OnboardingStep[] = [
    {
        id: GROUPS_INTRO_ID,
        title: 'common.groups',
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.groups.groupsIntro_component',
                        components: {
                            paraph: <p />,
                            bold: <strong />,
                            aLink: (
                                // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
                                <a
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    href="https://datahubproject.io/docs/authorization/groups"
                                />
                            ),
                        },
                    }}
                />
            </Typography.Paragraph>
        ),
    },
    {
        id: GROUPS_CREATE_GROUP_ID,
        selector: `#${GROUPS_CREATE_GROUP_ID}`,
        title: 'onBoarding.groups.createGroupsTitle',
        content: (
            <Typography.Paragraph>
                <p>
                    <Trans
                        {...{
                            i18nKey: 'onBoarding.groups.createGroups_component',
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
