import { Avatar, Tooltip } from 'antd';
import { TooltipPlacement } from 'antd/lib/tooltip';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import defaultAvatar from '../../../images/default_avatar.png';
import getAvatarColor from './getAvatarColor';

const AvatarStyled = styled(Avatar)<{ size?: number; $backgroundColor?: string }>`
    color: #fff;
    background-color: ${(props) => (props.$backgroundColor ? `${props.$backgroundColor}` : 'transparent')};
    font-size: ${(props) => (props.size ? `${Math.max(props.size / 2.0, 12)}px` : '14px')} !important;
    margin-right: 4px;
    height: 24px;
    width: 24px;

    .ant-avatar-string {
        text-align: center;
        top: 0px;
        line-height: ${(props) => (props.size ? props.size : 24)}px;
    }
`;

type Props = {
    url?: string;
    photoUrl?: string;
    useDefaultAvatar?: boolean;
    name?: string;
    style?: React.CSSProperties;
    placement?: TooltipPlacement;
    size?: number;
    isGroup?: boolean;
    isPolicy?: boolean;
    isRole?: boolean;
    hideTooltip?: boolean;
};

// TODO: Refactor Policy and Role to NOT use CustomAvatar and use a clickable link instead
export default function CustomAvatar({
    url,
    photoUrl,
    useDefaultAvatar,
    name,
    style,
    placement,
    size,
    isGroup = false,
    isPolicy = false,
    isRole = false,
    hideTooltip = false,
}: Props) {
    const { t } = useTranslation();
    const avatarWithInitial = name ? (
        <AvatarStyled style={style} size={size} $backgroundColor={getAvatarColor(name)}>
            {name.charAt(0).toUpperCase()}
        </AvatarStyled>
    ) : (
        <AvatarStyled src={defaultAvatar} style={style} size={size} $backgroundColor={getAvatarColor(name)} />
    );
    const avatarWithDefault = useDefaultAvatar ? (
        <AvatarStyled src={defaultAvatar} style={style} size={size} $backgroundColor={getAvatarColor(name)} />
    ) : (
        avatarWithInitial
    );
    const avatar =
        photoUrl && photoUrl !== '' ? <AvatarStyled src={photoUrl} style={style} size={size} /> : avatarWithDefault;
    if (!name) {
        return url ? <Link to={url}>{avatar}</Link> : avatar;
    }

    const renderTitle = (input) => {
        let title = `${input}`;
        if (isGroup) {
            title = `${title} - ${t('common.group')}`;
        } else if (isPolicy) {
            title = `${title}`;
        } else if (isRole) {
            title = `${title} - ${t('common.role')}`;
        }
        return title;
    };

    const linkNode = url ? <Link to={url}>{avatar}</Link> : avatar;

    return hideTooltip ? (
        linkNode
    ) : (
        <Tooltip title={renderTitle(name)} placement={placement}>
            {linkNode}
        </Tooltip>
    );
}
