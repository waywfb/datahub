import React from 'react';
import { Typography } from 'antd';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { RoutedTabs } from '../shared/RoutedTabs';
import { GroupList } from './group/GroupList';
import { UserList } from './user/UserList';

const PageContainer = styled.div`
    padding-top: 20px;
    width: 100%;
`;

const PageHeaderContainer = styled.div`
    && {
        padding-left: 24px;
    }
`;

const PageTitle = styled(Typography.Title)`
    && {
        margin-bottom: 12px;
    }
`;

const Content = styled.div`
    &&& .ant-tabs-nav {
        margin: 0;
    }
    color: #262626;
    height: calc(100vh - 60px);

    &&& .ant-tabs > .ant-tabs-nav .ant-tabs-nav-wrap {
        padding-left: 28px;
    }
`;

enum TabType {
    Users = 'Users',
    Groups = 'Groups',
}
const ENABLED_TAB_TYPES = [TabType.Users, TabType.Groups];

export const ManageIdentities = () => {
    const { t } = useTranslation();
    /**
     * Determines which view should be visible: users or groups list.
     */

    const getTabs = () => {
        return [
            {
                title: t('common.users'),
                name: TabType.Users,
                path: TabType.Users.toLocaleLowerCase(),
                content: <UserList />,
                display: {
                    enabled: () => true,
                },
            },
            {
                title: t('common.groups'),
                name: TabType.Groups,
                path: TabType.Groups.toLocaleLowerCase(),
                content: <GroupList />,
                display: {
                    enabled: () => true,
                },
            },
        ].filter((tab) => ENABLED_TAB_TYPES.includes(tab.name));
    };

    const defaultTabPath = getTabs() && getTabs()?.length > 0 ? getTabs()[0].path : '';
    const onTabChange = () => null;

    return (
        <PageContainer>
            <PageHeaderContainer>
                <PageTitle level={3}>{t('settings.manageWithName', { name: t('settings.usersAndGroups') })}</PageTitle>
                <Typography.Paragraph type="secondary">
                    {t('settings.manageIdentitiesDescription')}
                </Typography.Paragraph>
            </PageHeaderContainer>
            <Content>
                <RoutedTabs defaultPath={defaultTabPath} tabs={getTabs()} onTabChange={onTabChange} />
            </Content>
        </PageContainer>
    );
};
