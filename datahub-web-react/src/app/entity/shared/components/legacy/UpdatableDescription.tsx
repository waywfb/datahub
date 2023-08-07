import { message, Tag } from 'antd';
import React, { useState } from 'react';
import { FetchResult, MutationFunctionOptions } from '@apollo/client';
import styled from 'styled-components';
import MarkdownViewer from './MarkdownViewer';
import UpdateDescriptionModal from './DescriptionModal';
import analytics, { EventType, EntityActionType } from '../../../../analytics';
import { EntityType } from '../../../../../types.generated';
import { useTranslation } from 'react-i18next';

const DescriptionText = styled(MarkdownViewer)`
    ${(props) => (props.isCompact ? 'max-width: 377px;' : '')};
`;

const AddNewDescription = styled(Tag)`
    cursor: pointer;
`;

export type Props = {
    isCompact?: boolean;
    updateEntity: (options?: MutationFunctionOptions<any, any> | undefined) => Promise<FetchResult>;
    updatedDescription?: string | null;
    originalDescription?: string | null;
    entityType: EntityType;
    urn: string;
};

export default function UpdatableDescription({
    isCompact,
    updateEntity,
    updatedDescription,
    originalDescription,
    entityType,
    urn,
}: Props) {
    const { t } = useTranslation();
    const [showAddDescModal, setShowAddDescModal] = useState(false);
    const onSubmit = async (description: string | null) => {
        message.loading({ content: t('common.loading') + '...' });
        try {
            await updateEntity({
                variables: { urn, input: { editableProperties: { description: description || '' } } },
            });
            message.destroy();
            analytics.event({
                type: EventType.EntityActionEvent,
                actionType: EntityActionType.UpdateDescription,
                entityType,
                entityUrn: urn,
            });
            message.success({ content: t('crud.success.update'), duration: 2 });
        } catch (e: unknown) {
            message.destroy();
            if (e instanceof Error) message.error({ content: `${t('crud.error.update')}: \n ${e.message || ''}`, duration: 2 });
        }
        setShowAddDescModal(false);
    };

    return (
        <>
            {updatedDescription || originalDescription ? (
                <>
                    <DescriptionText
                        isCompact={isCompact}
                        source={updatedDescription || originalDescription || ''}
                        editable
                        onEditClicked={() => setShowAddDescModal(true)}
                    />
                    {showAddDescModal && (
                        <UpdateDescriptionModal
                            title={t('crud.updateWithName', { name: t('common.description').toLowerCase() })}
                            onClose={() => setShowAddDescModal(false)}
                            onSubmit={onSubmit}
                            original={originalDescription || ''}
                            description={updatedDescription || ''}
                        />
                    )}
                </>
            ) : (
                <>
                    <AddNewDescription color="success" onClick={() => setShowAddDescModal(true)}>
                        + {t('crud.addWithName', { name: t('common.description') })}
                    </AddNewDescription>
                    {showAddDescModal && (
                        <UpdateDescriptionModal
                            title={t('crud.addWithName', { name: t('common.description').toLowerCase() })}
                            onClose={() => setShowAddDescModal(false)}
                            onSubmit={onSubmit}
                            isAddDesc
                        />
                    )}
                </>
            )}
        </>
    );
}
