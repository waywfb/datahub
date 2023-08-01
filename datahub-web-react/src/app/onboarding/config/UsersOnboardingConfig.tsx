import React from 'react';
import { Typography } from 'antd';
import { Trans } from 'react-i18next';
import { OnboardingStep } from '../OnboardingStep';

export const USERS_INTRO_ID = 'users-intro';
export const USERS_SSO_ID = 'users-sso';
export const USERS_INVITE_LINK_ID = 'users-invite-link';
export const USERS_ASSIGN_ROLE_ID = 'users-assign-role';

export const UsersOnboardingConfig: OnboardingStep[] = [
    {
        id: USERS_INTRO_ID,
        title: 'common.users',
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.users.usersIntro_component',
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
        id: USERS_SSO_ID,
        title: 'onBoarding.users.usersSSOTitle',
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.users.usersSSO_component',
                        components: {
                            paraph: <p />,
                            bold: <strong />,
                            aLink: (
                                // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
                                <a
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    href="https://datahubproject.io/docs/authentication/guides/sso/configure-oidc-react/#configuring-oidc-in-react"
                                />
                            ),
                        },
                    }}
                />
            </Typography.Paragraph>
        ),
    },
    {
        id: USERS_INVITE_LINK_ID,
        selector: `#${USERS_INVITE_LINK_ID}`,
        title: 'onBoarding.users.usersInviteLinkTitle',
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.users.usersInviteLink_component',
                        components: {
                            paraph: <p />,
                            bold: <strong />,
                            aLink: (
                                // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
                                <a
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    href="https://datahubproject.io/docs/authentication/guides/add-users/#send-prospective-users-an-invite-link"
                                />
                            ),
                        },
                    }}
                />
            </Typography.Paragraph>
        ),
    },
    {
        id: USERS_ASSIGN_ROLE_ID,
        selector: `#${USERS_ASSIGN_ROLE_ID}`,
        title: 'onBoarding.users.usersAssignRoleIDTitle',
        content: (
            <Typography.Paragraph>
                <Trans
                    {...{
                        i18nKey: 'onBoarding.users.usersAssignRoleID_component',
                        components: {
                            paraph: <p />,
                            bold: <strong />,
                            aLink: (
                                // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
                                <a
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    href="https://datahubproject.io/docs/authorization/roles"
                                />
                            ),
                        },
                    }}
                />
            </Typography.Paragraph>
        ),
    },
];
