import { PlusOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { EntityType, Ownership } from '../../../types.generated';
import { ExpandedOwner } from '../shared/components/styled/ExpandedOwner/ExpandedOwner';
import { EditOwnersModal } from '../shared/containers/profile/sidebar/Ownership/EditOwnersModal';
import { DisplayCount, GroupSectionTitle, GroupSectionHeader } from '../shared/SidebarStyledComponents';
import { useTranslation } from 'react-i18next';

const SectionWrapper = styled.div``;

const AddOwnerButton = styled(Button)``;

type Props = {
    ownership: Ownership;
    refetch: () => Promise<any>;
    urn: string;
};

export default function GroupOwnerSideBarSection({ urn, ownership, refetch }: Props) {
    const { t } = useTranslation();
    const [showAddModal, setShowAddModal] = useState(false);
    const ownersEmpty = !ownership?.owners?.length;

    return (
        <>
            <GroupSectionHeader>
                <GroupSectionTitle>{t('common.owenrs')}</GroupSectionTitle>
                <DisplayCount>{ownership?.owners?.length || ''}</DisplayCount>
            </GroupSectionHeader>
            <SectionWrapper>
                {ownership &&
                    ownership?.owners?.map((owner) => (
                        <ExpandedOwner entityUrn={urn} owner={owner} refetch={refetch} />
                    ))}
                {ownersEmpty && (
                    <Typography.Paragraph type="secondary">{t('group.noGroupOwnersAdded')}</Typography.Paragraph>
                )}
                {ownersEmpty && (
                    <AddOwnerButton onClick={() => setShowAddModal(true)}>
                        <PlusOutlined />
                        {t('crud.addWithName', { name: t('common.owners') })}
                    </AddOwnerButton>
                )}
                {!ownersEmpty && (
                    <AddOwnerButton type="text" style={{ padding: 0 }} onClick={() => setShowAddModal(true)}>
                        <PlusOutlined />
                        {t('crud.addWithName', { name: t('common.owners') })}
                    </AddOwnerButton>
                )}
            </SectionWrapper>
            {showAddModal && (
                <EditOwnersModal
                    urns={[urn]}
                    hideOwnerType
                    entityType={EntityType.CorpGroup}
                    refetch={refetch}
                    onCloseModal={() => {
                        setShowAddModal(false);
                    }}
                />
            )}
        </>
    );
}
