import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { Menu, Dropdown, Typography } from 'antd';
import { CaretDownOutlined, TranslationOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { EntityType } from '../../types.generated';
import { useEntityRegistry } from '../useEntityRegistry';
import { GlobalCfg } from '../../conf';
import { isLoggedInVar } from '../auth/checkAuthStatus';
import CustomAvatar from './avatar/CustomAvatar';
import analytics, { EventType } from '../analytics';
import { ANTD_GRAY } from '../entity/shared/constants';
import { useAppConfig } from '../useAppConfig';
import { useUserContext } from '../context/useUserContext';
import ChangeLanguageModal from '../home/modal/ChangeLanguageModal';
import { LANGUAGE_LIST } from '../../conf/Global';

const MenuItem = styled(Menu.Item)`
    display: flex;
    justify-content: start;
    align-items: center;
    && {
        margin-top: 2px;
    }
    & > a:visited,
    & > a:active,
    & > a:focus {
        clear: both;
        border: none;
        outline: 0;
    }
`;

const DownArrow = styled(CaretDownOutlined)`
    vertical-align: -1px;
    font-size: 10px;
    color: ${ANTD_GRAY[7]};
`;

const DropdownWrapper = styled.div`
    align-items: center;
    cursor: pointer;
    display: flex;
`;

interface Props {
    urn: string;
    pictureLink?: string;
    name?: string;
}

const defaultProps = {
    pictureLink: undefined,
};

const menuIconSize = '20px';
const TranslationOutlinedStyled = styled(TranslationOutlined)`
    color: grey;
    height: ${menuIconSize};
    width: ${menuIconSize};
`;
const MenuLabel = styled(Typography.Text)`
    vertical-align: top;
`;

export const ManageAccount = ({ urn: _urn, pictureLink: _pictureLink, name }: Props) => {
    const { t } = useTranslation(['translation', 'theme']);
    const entityRegistry = useEntityRegistry();
    const { config } = useAppConfig();
    const userContext = useUserContext();
    const handleLogout = () => {
        analytics.event({ type: EventType.LogOutEvent });
        isLoggedInVar(false);
        Cookies.remove(GlobalCfg.CLIENT_AUTH_COOKIE);
        userContext.updateLocalState({ selectedViewUrn: undefined });
    };

    const [isChangeLanguage, setIsChangeLanguage] = useState(false);

    const version = config?.appVersion;
    // const menuItems: any[] = t('menuItems', { ns: ['theme'], returnObjects: true });
    const menu = (
        <Menu style={{ width: '120px' }}>
            {version && version !== 'null' && (
                <MenuItem key="version" disabled style={{ color: '#8C8C8C' }}>
                    {version}
                </MenuItem>
            )}
            <Menu.Divider />
            <MenuItem key="profile">
                <a
                    href={`/${entityRegistry.getPathName(EntityType.CorpUser)}/${_urn}`}
                    rel="noopener noreferrer"
                    tabIndex={0}
                >
                    {t('navigation.yourProfile')}
                </a>
            </MenuItem>
            {LANGUAGE_LIST.length > 1 && (
                <>
                    <Menu.Divider />
                    <MenuItem onClick={() => setIsChangeLanguage(true)}>
                        <MenuLabel>{`${t('common.language')} `}</MenuLabel>
                        <TranslationOutlinedStyled style={{ fontSize: menuIconSize }} />
                    </MenuItem>
                </>
            )}
            <Menu.Divider />
            {Array(...(t('menuItems', { ns: ['theme'], returnObjects: true }) as any[])).map((value) => (
                <MenuItem key={value.label}>
                    <a
                        href={value.path || ''}
                        target={value.shouldOpenInNewTab ? '_blank' : ''}
                        rel="noopener noreferrer"
                        tabIndex={0}
                    >
                        {value.label}
                    </a>
                </MenuItem>
            ))}
            <MenuItem key="graphiQLLink">
                <a href="/api/graphiql">GraphiQL</a>
            </MenuItem>
            <MenuItem key="openapiLink">
                <a href="/openapi/swagger-ui/index.html">OpenAPI</a>
            </MenuItem>
            <Menu.Divider />
            <MenuItem danger key="logout" tabIndex={0}>
                <a href="/logOut" onClick={handleLogout} data-testid="log-out-menu-item">
                    {t('authentification.signOut')}
                </a>
            </MenuItem>
        </Menu>
    );

    return (
        <>
            <Dropdown overlay={menu} trigger={['click']}>
                <DropdownWrapper data-testid="manage-account-menu">
                    <CustomAvatar photoUrl={_pictureLink} style={{ marginRight: 4 }} name={name} />
                    <DownArrow />
                </DropdownWrapper>
            </Dropdown>
            <ChangeLanguageModal visible={isChangeLanguage} onClose={() => setIsChangeLanguage(false)} />
        </>
    );
};

ManageAccount.defaultProps = defaultProps;
