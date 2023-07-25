import React, { useState } from 'react';
import { message, Button, Input, Modal, Space } from 'antd';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useBatchAddTagsMutation } from '../../../graphql/mutations.generated';
import { useCreateTagMutation } from '../../../graphql/tag.generated';
import { EntityType, ResourceRefInput } from '../../../types.generated';
import { useEnterKeyListener } from '../useEnterKeyListener';
import { handleBatchError } from '../../entity/shared/utils';
import { useEntityRegistry } from '../../useEntityRegistry';

type CreateTagModalProps = {
    visible: boolean;
    onClose: () => void;
    onBack: () => void;
    tagName: string;
    resources: ResourceRefInput[];
};

const FullWidthSpace = styled(Space)`
    width: 100%;
`;

export default function CreateTagModal({ onClose, onBack, visible, tagName, resources }: CreateTagModalProps) {
    const entityRegistry = useEntityRegistry();
    const { t } = useTranslation();

    const [stagedDescription, setStagedDescription] = useState('');
    const [batchAddTagsMutation] = useBatchAddTagsMutation();

    const [createTagMutation] = useCreateTagMutation();
    const [disableCreate, setDisableCreate] = useState(false);

    const onOk = () => {
        setDisableCreate(true);
        // first create the new tag
        const tagUrn = `urn:li:tag:${tagName}`;
        createTagMutation({
            variables: {
                input: {
                    id: tagName,
                    name: tagName,
                    description: stagedDescription,
                },
            },
        })
            .then(() => {
                // then apply the tag to the dataset
                batchAddTagsMutation({
                    variables: {
                        input: {
                            tagUrns: [tagUrn],
                            resources,
                        },
                    },
                })
                    .catch((e) => {
                        message.destroy();
                        message.error(
                            handleBatchError(
                                resources,
                                e,
                                {
                                    content: `${t('crud.error.addWithName', {
                                        name: entityRegistry.getEntityNameTrans(EntityType.Tag, t),
                                    })}: \n ${e.message || ''}`,
                                    duration: 3,
                                },
                                t,
                            ),
                        );
                        onClose();
                    })
                    .finally(() => {
                        // and finally close the modal
                        setDisableCreate(false);
                        onClose();
                    });
            })
            .catch((e) => {
                message.destroy();
                message.error({
                    content: `${t('crud.error.createWithName', {
                        name: entityRegistry.getEntityNameTrans(EntityType.Tag, t),
                    })}: \n ${e.message || ''}`,
                    duration: 3,
                });
                onClose();
            });
    };

    // Handle the Enter press
    useEnterKeyListener({
        querySelectorToExecuteClick: '#createTagButton',
    });

    return (
        <Modal
            title={`${t('crud.createWithName', { name: tagName })}`}
            visible={visible}
            onCancel={onClose}
            footer={
                <>
                    <Button onClick={onBack} type="text">
                        {t('common.back')}
                    </Button>
                    <Button id="createTagButton" onClick={onOk} disabled={disableCreate}>
                        {t('common.create')}
                    </Button>
                </>
            }
        >
            <FullWidthSpace direction="vertical">
                <Input.TextArea
                    placeholder={t('placeholder.addDescriptionForNewTag')}
                    value={stagedDescription}
                    onChange={(e) => setStagedDescription(e.target.value)}
                />
            </FullWidthSpace>
        </Modal>
    );
}
