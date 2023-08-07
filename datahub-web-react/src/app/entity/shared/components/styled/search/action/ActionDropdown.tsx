import React from 'react';
import { Button, Dropdown, Menu, Tooltip } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import MenuItem from 'antd/lib/menu/MenuItem';
import { useTranslation } from 'react-i18next';
import { ANTD_GRAY } from '../../../../constants';

const DownArrow = styled(CaretDownOutlined)`
    && {
        padding-top: 4px;
        font-size: 8px;
        margin-left: 2px;
        margin-top: 2px;
        color: ${ANTD_GRAY[7]};
    }
`;

const StyledMenuItem = styled(MenuItem)`
    && {
        padding: 0;
    }
`;

const ActionButton = styled(Button)`
    font-weight: normal;
`;

const DropdownWrapper = styled.div<{
    disabled: boolean;
}>`
    cursor: ${(props) => (props.disabled ? 'normal' : 'pointer')};
    color: ${(props) => (props.disabled ? ANTD_GRAY[7] : 'none')};
    display: flex;
    margin-left: 12px;
    margin-right: 12px;
`;

export type Action = {
    title: React.ReactNode;
    onClick: () => void;
};

type Props = {
    name: string;
    actions: Array<Action>;
    disabled?: boolean;
};

export default function ActionDropdown({ name, actions, disabled }: Props) {
    const { t } = useTranslation();
    return (
        <Tooltip title={disabled ? t('common.actionNotSupportedMessage') : ''}>
            <Dropdown
                disabled={disabled}
                trigger={['click']}
                overlay={
                    <Menu>
                        {actions.map((action) => (
                            <StyledMenuItem>
                                <ActionButton type="text" onClick={action.onClick}>
                                    {action.title}
                                </ActionButton>
                            </StyledMenuItem>
                        ))}
                    </Menu>
                }
            >
                <DropdownWrapper disabled={!!disabled}>
                    {name}
                    <DownArrow />
                </DropdownWrapper>
            </Dropdown>
        </Tooltip>
    );
}
