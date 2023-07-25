import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Divider, Modal, Tag, Typography } from 'antd';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useEntityRegistry } from '../../useEntityRegistry';
import { Maybe, Policy, PolicyState, PolicyType } from '../../../types.generated';
import { useAppConfig } from '../../useAppConfig';
import { convertLegacyResourceFilter, getFieldValues, mapResourceTypeToDisplayName } from './policyUtils';
import AvatarsGroup from '../AvatarsGroup';

type PrivilegeOptionType = {
    type?: string;
    name?: Maybe<string>;
};

type Props = {
    policy: Omit<Policy, 'urn'>;
    visible: boolean;
    onClose: () => void;
    privileges: PrivilegeOptionType[] | undefined;
};

const PolicyContainer = styled.div`
    padding-left: 20px;
    padding-right: 20px;
    > div {
        margin-bottom: 32px;
    }
`;

const ButtonsContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: flex-end;
    align-items: center;
`;

const ThinDivider = styled(Divider)`
    margin-top: 8px;
    margin-bottom: 8px;
`;

const PoliciesTag = styled(Tag)`
    && {
        border-radius: 2px !important;
    }
`;

const PrivilegeTag = styled(Tag)`
    && {
        border-radius: 2px !important;
    }
`;
const Privileges = styled.div`
    & ${PrivilegeTag}:nth-child(n+1) {
        margin-top: 5px !important;
    }
`;

/**
 * Component used for displaying the details about an existing Policy.
 */
export default function PolicyDetailsModal({ policy, visible, onClose, privileges }: Props) {
    const { t } = useTranslation();
    const entityRegistry = useEntityRegistry();

    const isActive = policy?.state === PolicyState.Active;
    const isMetadataPolicy = policy?.type === PolicyType.Metadata;

    const resources = convertLegacyResourceFilter(policy?.resources);
    const resourceTypes = getFieldValues(resources?.filter, 'RESOURCE_TYPE') || [];
    const resourceEntities = getFieldValues(resources?.filter, 'RESOURCE_URN') || [];
    const domains = getFieldValues(resources?.filter, 'DOMAIN') || [];

    const {
        config: { policiesConfig },
    } = useAppConfig();

    const actionButtons = (
        <ButtonsContainer>
            <Button onClick={onClose}>{t('common.close')}</Button>
        </ButtonsContainer>
    );

    const getDisplayName = (entity) => {
        if (!entity) {
            return null;
        }
        // TODO: jm translate this ?
        return entityRegistry.getDisplayName(entity.type, entity);
    };

    const getEntityTag = (criterionValue) => {
        return (
            (criterionValue.entity && (
                <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    to={() => `${entityRegistry.getEntityUrl(criterionValue.entity!.type, criterionValue.value)}`}
                >
                    {getDisplayName(criterionValue.entity)}
                </Link>
            )) || <Typography.Text>{criterionValue.value}</Typography.Text>
        );
    };

    // TODO: jm translate this ? (policy.*, getEntityTag(value))
    return (
        <Modal title={policy?.name} visible={visible} onCancel={onClose} closable width={800} footer={actionButtons}>
            <PolicyContainer>
                <div>
                    <Typography.Title level={5}>{t('common.type')}</Typography.Title>
                    <ThinDivider />
                    <PoliciesTag>{policy?.type}</PoliciesTag>
                </div>
                <div>
                    <Typography.Title level={5}>{t('common.state')}</Typography.Title>
                    <ThinDivider />
                    <Tag color={isActive ? 'green' : 'red'}>{policy?.state}</Tag>
                </div>
                <div>
                    <Typography.Title level={5}>{t('common.description')}</Typography.Title>
                    <ThinDivider />
                    <Typography.Text type="secondary">{policy?.description}</Typography.Text>
                </div>
                {isMetadataPolicy && (
                    <>
                        <div>
                            <Typography.Title level={5}>{`${t('common.asset')} ${t('common.type')}`}</Typography.Title>
                            <ThinDivider />
                            {(resourceTypes?.length &&
                                resourceTypes.map((value, key) => {
                                    return (
                                        // eslint-disable-next-line react/no-array-index-key
                                        <PoliciesTag key={`type-${value.value}-${key}`}>
                                            <Typography.Text>
                                                {mapResourceTypeToDisplayName(
                                                    value.value,
                                                    policiesConfig?.resourcePrivileges || [],
                                                )}
                                            </Typography.Text>
                                        </PoliciesTag>
                                    );
                                })) || <PoliciesTag>{t('common.all')}</PoliciesTag>}
                        </div>
                        <div>
                            <Typography.Title level={5}>{t('common.assets')}</Typography.Title>
                            <ThinDivider />
                            {(resourceEntities?.length &&
                                resourceEntities.map((value, key) => {
                                    return (
                                        // eslint-disable-next-line react/no-array-index-key
                                        <PoliciesTag key={`resource-${value.value}-${key}`}>
                                            {getEntityTag(value)}
                                        </PoliciesTag>
                                    );
                                })) || <PoliciesTag>{t('common.all')}</PoliciesTag>}
                        </div>
                        <div>
                            <Typography.Title level={5}>{t('common.domains')}</Typography.Title>
                            <ThinDivider />
                            {(domains?.length &&
                                domains.map((value, key) => {
                                    return (
                                        // eslint-disable-next-line react/no-array-index-key
                                        <PoliciesTag key={`domain-${value.value}-${key}`}>
                                            {getEntityTag(value)}
                                        </PoliciesTag>
                                    );
                                })) || <PoliciesTag>{t('common.all')}</PoliciesTag>}
                        </div>
                    </>
                )}
                <Privileges>
                    <Typography.Title level={5}>{t('common.privileges')}</Typography.Title>
                    <ThinDivider />
                    {privileges?.map((priv, key) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <PrivilegeTag key={`${priv}-${key}`}>{priv?.name}</PrivilegeTag>
                    ))}
                </Privileges>
                <div>
                    <Typography.Title level={5}>
                        {t('permissions.appliesToWithName', { name: t('common.owners') })}
                    </Typography.Title>
                    <ThinDivider />
                    <PoliciesTag>{policy?.actors?.resourceOwners ? 'True' : 'False'}</PoliciesTag>
                </div>
                <div>
                    <Typography.Title level={5}>
                        {t('permissions.appliesToWithName', { name: t('common.users') })}
                    </Typography.Title>
                    <ThinDivider />
                    <AvatarsGroup
                        users={policy?.actors?.resolvedUsers}
                        entityRegistry={entityRegistry}
                        maxCount={50}
                        size={28}
                    />
                    {policy?.actors?.allUsers ? <Tag>{`${t('common.all')} ${t('common.users')}`}</Tag> : null}
                </div>
                <div>
                    <Typography.Title level={5}>
                        {t('permissions.appliesToWithName', { name: t('common.groups') })}
                    </Typography.Title>
                    <ThinDivider />
                    <AvatarsGroup
                        groups={policy?.actors?.resolvedGroups}
                        entityRegistry={entityRegistry}
                        maxCount={50}
                        size={28}
                    />
                    {policy?.actors?.allGroups ? <Tag>{`${t('common.all')} ${t('common.groups')}`}</Tag> : null}
                </div>
                <div>
                    <Typography.Title level={5}>
                        {t('permissions.appliesToWithName', { name: t('common.roles') })}
                    </Typography.Title>
                    <ThinDivider />
                    <AvatarsGroup
                        roles={policy?.actors?.resolvedRoles}
                        entityRegistry={entityRegistry}
                        maxCount={50}
                        size={28}
                    />
                </div>
            </PolicyContainer>
        </Modal>
    );
}
