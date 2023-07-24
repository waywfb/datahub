import React, { useState } from 'react';
import styled from 'styled-components';
import { Tooltip } from 'antd';
import { CheckOutlined, MailOutlined } from '@ant-design/icons';
import EmailShare from 'react-email-share-link';
import MenuItem from 'antd/lib/menu/MenuItem';
import { useTranslation } from 'react-i18next';
import { ANTD_GRAY } from '../../../entity/shared/constants';

interface EmailMenuItemProps {
    urn: string;
    name: string;
    type: string;
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

export default function EmailMenuItem({ urn, name, type, key }: EmailMenuItemProps) {
    /**
     * Whether button has been clicked
     */
    const [isClicked, setIsClicked] = useState(false);
    const linkText = window.location.href;
    const { t } = useTranslation();

    // TODO ndespouy traduction du type
    return (
        <StyledMenuItem
            key={key}
            onClick={() => {
                navigator.clipboard.writeText(urn);
                setIsClicked(true);
            }}
        >
            <EmailShare subject={`${name} | ${type}`} body={t('share.checkoutThisOn', { type, linkText })}>
                {(link) => (
                    <Tooltip title={t('share.shareThisViaMail', { type })}>
                        {isClicked ? <CheckOutlined /> : <MailOutlined />}
                        <TextSpan>
                            <a href={link} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
                                <b>Email</b>
                            </a>
                        </TextSpan>
                    </Tooltip>
                )}
            </EmailShare>
        </StyledMenuItem>
    );
}
