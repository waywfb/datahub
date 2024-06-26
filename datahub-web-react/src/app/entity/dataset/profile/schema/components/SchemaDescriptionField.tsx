import { Typography, message, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import styled from 'styled-components';
import { FetchResult } from '@apollo/client';

import { useTranslation } from 'react-i18next';
import { UpdateDatasetMutation } from '../../../../../../graphql/dataset.generated';
import UpdateDescriptionModal from '../../../../shared/components/legacy/DescriptionModal';
import StripMarkdownText, { removeMarkdown } from '../../../../shared/components/styled/StripMarkdownText';
import SchemaEditableContext from '../../../../../shared/SchemaEditableContext';
import { useEntityData } from '../../../../shared/EntityContext';
import analytics, { EventType, EntityActionType } from '../../../../../analytics';
import { Editor } from '../../../../shared/tabs/Documentation/components/editor/Editor';

const EditIcon = styled(EditOutlined)`
    cursor: pointer;
    display: none;
`;

const AddNewDescription = styled(Button)`
    display: none;
    margin: -4px;
    width: 140px;
`;

const ExpandedActions = styled.div`
    height: 10px;
`;

const DescriptionContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 22px;
    &:hover ${EditIcon} {
        display: inline-block;
    }

    &:hover ${AddNewDescription} {
        display: block;
    }
    & ins.diff {
        background-color: #b7eb8f99;
        text-decoration: none;
        &:hover {
            background-color: #b7eb8faa;
        }
    }
    & del.diff {
        background-color: #ffa39e99;
        text-decoration: line-through;
        &:hover {
            background-color: #ffa39eaa;
        }
    }
`;
const EditedLabel = styled(Typography.Text)`
    position: absolute;
    right: -10px;
    top: -15px;
    color: rgba(150, 150, 150, 0.5);
    font-style: italic;
`;

const ReadLessText = styled(Typography.Link)`
    margin-right: 4px;
`;

const StyledViewer = styled(Editor)`
    padding-right: 8px;
    display: block;

    .remirror-editor.ProseMirror {
        padding: 0;
    }
`;

type Props = {
    onExpanded: (expanded: boolean) => void;
    expanded: boolean;
    description: string;
    original?: string | null;
    onUpdate: (
        description: string,
    ) => Promise<FetchResult<UpdateDatasetMutation, Record<string, any>, Record<string, any>> | void>;
    isEdited?: boolean;
};

const ABBREVIATED_LIMIT = 80;

export default function DescriptionField({
    expanded,
    onExpanded: handleExpanded,
    description,
    onUpdate,
    isEdited = false,
    original,
}: Props) {
    const { t } = useTranslation();
    const [showAddModal, setShowAddModal] = useState(false);
    const overLimit = removeMarkdown(description).length > 80;
    const isSchemaEditable = React.useContext(SchemaEditableContext);
    const onCloseModal = () => setShowAddModal(false);
    const { urn, entityType } = useEntityData();

    const sendAnalytics = () => {
        analytics.event({
            type: EventType.EntityActionEvent,
            actionType: EntityActionType.UpdateSchemaDescription,
            entityType,
            entityUrn: urn,
        });
    };

    const onUpdateModal = async (desc: string | null) => {
        message.loading({ content: `${t('crud.updating')}...` });
        try {
            await onUpdate(desc || '');
            message.destroy();
            message.success({ content: t('crud.success.update'), duration: 2 });
            sendAnalytics();
        } catch (e: unknown) {
            message.destroy();
            if (e instanceof Error)
                message.error({ content: `${t('crud.error.update')}: \n ${e.message || ''}`, duration: 2 });
        }
        onCloseModal();
    };

    const EditButton =
        (isSchemaEditable && description && (
            <EditIcon twoToneColor="#52c41a" onClick={() => setShowAddModal(true)} />
        )) ||
        undefined;

    const showAddDescription = isSchemaEditable && !description;

    return (
        <DescriptionContainer>
            {expanded || !overLimit ? (
                <>
                    {!!description && <StyledViewer content={description} readOnly />}
                    {!!description && (
                        <ExpandedActions>
                            {overLimit && (
                                <ReadLessText
                                    onClick={() => {
                                        handleExpanded(false);
                                    }}
                                >
                                    {t('common.readLess')}
                                </ReadLessText>
                            )}
                            {EditButton}
                        </ExpandedActions>
                    )}
                </>
            ) : (
                <>
                    <StripMarkdownText
                        limit={ABBREVIATED_LIMIT}
                        readMore={
                            <>
                                <Typography.Link
                                    onClick={() => {
                                        handleExpanded(true);
                                    }}
                                >
                                    {t('common.readMore')}
                                </Typography.Link>
                            </>
                        }
                        suffix={EditButton}
                        shouldWrap
                    >
                        {description}
                    </StripMarkdownText>
                </>
            )}
            {isSchemaEditable && isEdited && <EditedLabel>(edited)</EditedLabel>}
            {showAddModal && (
                <div>
                    <UpdateDescriptionModal
                        title={t(description ? 'crud.updateWithName' : 'crud.addWithName', {
                            name: t('common.description').toLowerCase(),
                        })}
                        description={description}
                        original={original || ''}
                        onClose={onCloseModal}
                        onSubmit={onUpdateModal}
                        isAddDesc={!description}
                    />
                </div>
            )}
            {showAddDescription && (
                <AddNewDescription type="text" onClick={() => setShowAddModal(true)}>
                    + {t('crud.updateWithName', { name: t('common.description') })}
                </AddNewDescription>
            )}
        </DescriptionContainer>
    );
}
