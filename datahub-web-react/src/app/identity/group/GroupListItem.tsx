import { LockOutlined } from '@ant-design/icons';
import React from 'react';
import styled from 'styled-components';
import { List, Tag, Tooltip, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CorpGroup, EntityType, OriginType } from '../../../types.generated';
import CustomAvatar from '../../shared/avatar/CustomAvatar';
import { useEntityRegistry } from '../../useEntityRegistry';
import EntityDropdown from '../../entity/shared/EntityDropdown';
import { EntityMenuItems } from '../../entity/shared/EntityDropdown/EntityDropdown';
import { ELASTIC_MAX_COUNT, getElasticCappedTotalValueText } from '../../entity/shared/constants';

type Props = {
    group: CorpGroup;
    onDelete?: () => void;
};

const GroupItemContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding-left: 8px;
    padding-right: 8px;
    width: 100%;
`;

const GroupHeaderContainer = styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
`;

const GroupItemButtonGroup = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
`;

export default function GroupListItem({ group, onDelete }: Props) {
    const entityRegistry = useEntityRegistry();
    const { t } = useTranslation();
    const displayName = entityRegistry.getDisplayName(EntityType.CorpGroup, group);
    const isExternalGroup: boolean = group.origin?.type === OriginType.External;
    const externalGroupType: string = group.origin?.externalType || 'outside DataHub';

    return (
        <List.Item>
            <GroupItemContainer>
                <Link to={`${entityRegistry.getEntityUrl(EntityType.CorpGroup, group.urn)}`}>
                    <GroupHeaderContainer>
                        <CustomAvatar size={32} name={displayName} />
                        <div style={{ marginLeft: 16, marginRight: 16 }}>
                            <div>
                                <Typography.Text>{displayName}</Typography.Text>
                            </div>
                            <div>
                                <Typography.Text type="secondary">{group.properties?.description}</Typography.Text>
                            </div>
                        </div>
                        <Tag>
                            {(group as any).memberCount?.total < ELASTIC_MAX_COUNT
                                ? t('common.memberWithCount_interval', {
                                      postProcess: 'interval',
                                      count: (group as any).memberCount?.total || 0,
                                  })
                                : `${getElasticCappedTotalValueText((group as any).memberCount?.total || 0)} ${t(
                                      'common.members',
                                  )}`}
                        </Tag>
                    </GroupHeaderContainer>
                </Link>
                <GroupItemButtonGroup>
                    {isExternalGroup && (
                        <Tooltip title={t('group.cantEditBecauseExternalGroup', { externalGroupType })}>
                            <LockOutlined />
                        </Tooltip>
                    )}
                    <EntityDropdown
                        urn={group.urn}
                        entityType={EntityType.CorpGroup}
                        entityData={group}
                        menuItems={new Set([EntityMenuItems.DELETE])}
                        size={20}
                        onDeleteEntity={onDelete}
                        options={{ hideDeleteMessage: false, skipDeleteWait: true }}
                    />
                </GroupItemButtonGroup>
            </GroupItemContainer>
        </List.Item>
    );
}
