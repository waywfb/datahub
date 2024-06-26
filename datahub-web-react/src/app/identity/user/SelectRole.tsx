import React, { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { useApolloClient } from '@apollo/client';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { CorpUser, DataHubRole } from '../../../types.generated';
import AssignRoleConfirmation from './AssignRoleConfirmation';
import { mapRoleIcon } from './UserUtils';
import { ANTD_GRAY } from '../../entity/shared/constants';
import { clearRoleListCache } from '../../permissions/roles/cacheUtils';

const NO_ROLE_TRANS_KEY = 'permissions.noRole';
const NO_ROLE_URN = 'urn:li:dataHubRole:NoRole';

type Props = {
    user: CorpUser;
    userRoleUrn: string;
    selectRoleOptions: Array<DataHubRole>;
    refetch?: () => void;
};

const RoleSelect = styled(Select)<{ color?: string }>`
    min-width: 105px;
    ${(props) => (props.color ? ` color: ${props.color};` : '')}
`;

const RoleIcon = styled.span`
    margin-right: 6px;
    font-size: 12px;
`;

export default function SelectRole({ user, userRoleUrn, selectRoleOptions, refetch }: Props) {
    const client = useApolloClient();
    const { t } = useTranslation();
    const rolesMap: Map<string, DataHubRole> = new Map();
    selectRoleOptions.forEach((role) => {
        rolesMap.set(role.urn, role);
    });
    const allSelectRoleOptions = [{ urn: NO_ROLE_URN, name: t(NO_ROLE_TRANS_KEY) }, ...selectRoleOptions];
    const selectOptions = allSelectRoleOptions.map((role) => {
        return (
            <Select.Option key={role.urn} value={role.urn}>
                <RoleIcon>{mapRoleIcon(role.name)}</RoleIcon>
                {role.name}
            </Select.Option>
        );
    });

    const defaultRoleUrn = userRoleUrn || NO_ROLE_URN;
    const [currentRoleUrn, setCurrentRoleUrn] = useState<string>(defaultRoleUrn);
    const [isViewingAssignRole, setIsViewingAssignRole] = useState(false);

    const onSelectRole = (roleUrn: string) => {
        setCurrentRoleUrn(roleUrn);
        setIsViewingAssignRole(true);
    };

    const onCancel = () => {
        setCurrentRoleUrn(defaultRoleUrn);
        setIsViewingAssignRole(false);
    };

    const onConfirm = () => {
        setIsViewingAssignRole(false);
        setTimeout(() => {
            refetch?.();
            clearRoleListCache(client); // Update roles.
        }, 3000);
    };

    // wait for available roles to load
    if (!selectRoleOptions.length) return null;

    return (
        <>
            <RoleSelect
                placeholder={
                    <>
                        <UserOutlined style={{ marginRight: 6, fontSize: 12 }} />
                        {t(NO_ROLE_TRANS_KEY)}
                    </>
                }
                value={currentRoleUrn}
                onChange={(e) => onSelectRole(e as string)}
                color={currentRoleUrn === NO_ROLE_URN ? ANTD_GRAY[6] : undefined}
            >
                {selectOptions}
            </RoleSelect>
            <AssignRoleConfirmation
                visible={isViewingAssignRole}
                roleToAssign={rolesMap.get(currentRoleUrn)}
                userUrn={user.urn}
                username={user.username}
                onClose={onCancel}
                onConfirm={onConfirm}
            />
        </>
    );
}
