import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { CheckOutlined, LinkOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import MenuItem from 'antd/lib/menu/MenuItem';
import { useTranslation } from 'react-i18next';
import { ANTD_GRAY } from '../../../entity/shared/constants';

interface CopyLinkMenuItemProps {
    key: string;
}

const StyledMenuItem = styled(MenuItem)`
    && {
        color: ${ANTD_GRAY[8]};
        background-color: ${ANTD_GRAY[1]};
    }
`;

const TextSpan = styled.span`
    padding-left: 12px;
`;

const StyledLinkOutlined = styled(LinkOutlined)`
    font-size: 14px;
`;

export default function CopyLinkMenuItem({ key }: CopyLinkMenuItemProps) {
    /**
     * Whether button has been clicked
     */
    const [isClicked, setIsClicked] = useState(false);
    const { t } = useTranslation();

    return (
        <StyledMenuItem
            key={key}
            onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setIsClicked(true);
            }}
        >
            <Tooltip title={t('copyShareableLinkToEntity')}>
                {isClicked ? <CheckOutlined /> : <StyledLinkOutlined />}
                <TextSpan>
                    <b>{t('copy.copyLink')}</b>
                </TextSpan>
            </Tooltip>
        </StyledMenuItem>
    );
}
