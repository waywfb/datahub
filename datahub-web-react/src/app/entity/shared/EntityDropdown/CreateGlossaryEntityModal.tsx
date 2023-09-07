import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { EditOutlined } from '@ant-design/icons';
import { message, Button, Input, Modal, Typography, Form, Collapse } from 'antd';
import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';
import {
    useCreateGlossaryTermMutation,
    useCreateGlossaryNodeMutation,
} from '../../../../graphql/glossaryTerm.generated';
import { EntityType } from '../../../../types.generated';
import { useEntityRegistry } from '../../../useEntityRegistry';
import NodeParentSelect from './NodeParentSelect';
import { useEntityData, useRefetch } from '../EntityContext';
import analytics, { EventType } from '../../../analytics';
import DescriptionModal from '../components/legacy/DescriptionModal';
import { validateCustomUrnId } from '../../../shared/textUtil';
import { useGlossaryEntityData } from '../GlossaryEntityContext';
import { getGlossaryRootToUpdate, updateGlossarySidebar } from '../../../glossary/utils';

const StyledItem = styled(Form.Item)`
    margin-bottom: 0;
`;

const OptionalWrapper = styled.span`
    font-weight: normal;
`;

const StyledButton = styled(Button)`
    padding: 0;
`;

interface Props {
    entityType: EntityType;
    onClose: () => void;
    refetchData?: () => void;
}

function CreateGlossaryEntityModal(props: Props) {
    const { t } = useTranslation();
    const { entityType, onClose, refetchData } = props;
    const entityData = useEntityData();
    const { isInGlossaryContext, urnsToUpdate, setUrnsToUpdate } = useGlossaryEntityData();
    const [form] = Form.useForm();
    const entityRegistry = useEntityRegistry();
    const [stagedId, setStagedId] = useState<string | undefined>(undefined);
    const [stagedName, setStagedName] = useState('');
    const [selectedParentUrn, setSelectedParentUrn] = useState(entityData.urn);
    const [documentation, setDocumentation] = useState('');
    const [isDocumentationModalVisible, setIsDocumentationModalVisible] = useState(false);
    const [createButtonDisabled, setCreateButtonDisabled] = useState(true);
    const refetch = useRefetch();

    const [createGlossaryTermMutation] = useCreateGlossaryTermMutation();
    const [createGlossaryNodeMutation] = useCreateGlossaryNodeMutation();

    function createGlossaryEntity() {
        const mutation =
            entityType === EntityType.GlossaryTerm ? createGlossaryTermMutation : createGlossaryNodeMutation;

        const sanitizedDescription = DOMPurify.sanitize(documentation);
        mutation({
            variables: {
                input: {
                    id: stagedId?.length ? stagedId : undefined,
                    name: stagedName,
                    parentNode: selectedParentUrn || null,
                    description: sanitizedDescription || null,
                },
            },
        })
            .then(() => {
                message.loading({ content: `${t('crud.updating')}...`, duration: 2 });
                setTimeout(() => {
                    analytics.event({
                        type: EventType.CreateGlossaryEntityEvent,
                        entityType,
                        parentNodeUrn: selectedParentUrn || undefined,
                    });
                    message.success({
                        content: `Created ${entityRegistry.getEntityNameTrans(entityType, t)}!`,
                        duration: 2,
                    });
                    refetch();
                    if (isInGlossaryContext) {
                        // either refresh this current glossary node or the root nodes or root terms
                        const nodeToUpdate = entityData?.urn || getGlossaryRootToUpdate(entityType);
                        updateGlossarySidebar([nodeToUpdate], urnsToUpdate, setUrnsToUpdate);
                    }
                    if (refetchData) {
                        refetchData();
                    }
                }, 2000);
            })
            .catch((e) => {
                message.destroy();
                message.error({ content: `${t('crud.error.create')}: \n ${e.message || ''}`, duration: 3 });
            });
        onClose();
    }

    function addDocumentation(description: string) {
        setDocumentation(description);
        setIsDocumentationModalVisible(false);
    }

    return (
        <Modal
            title={t('crud.createWithName', { name: entityRegistry.getEntityNameTrans(entityType, t) })}
            visible
            onCancel={onClose}
            footer={
                <>
                    <Button onClick={onClose} type="text">
                        {t('common.cancel')}
                    </Button>
                    <Button onClick={createGlossaryEntity} disabled={createButtonDisabled}>
                        {t('common.create')}
                    </Button>
                </>
            }
        >
            <Form
                form={form}
                initialValues={{
                    parent: selectedParentUrn,
                }}
                layout="vertical"
                onFieldsChange={() =>
                    setCreateButtonDisabled(form.getFieldsError().some((field) => field.errors.length > 0))
                }
            >
                <Form.Item label={<Typography.Text strong>{t('common.name')}</Typography.Text>}>
                    <StyledItem
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: t('form.enterANameWithName', {
                                    name: entityRegistry.getEntityNameTrans(entityType, t),
                                }),
                            },
                            { whitespace: true },
                            { min: 1, max: 100 },
                        ]}
                        hasFeedback
                    >
                        <Input autoFocus value={stagedName} onChange={(event) => setStagedName(event.target.value)} />
                    </StyledItem>
                </Form.Item>
                <Form.Item
                    label={
                        <Typography.Text strong>
                            {t('common.parent')} <OptionalWrapper>({t('common.optional')})</OptionalWrapper>
                        </Typography.Text>
                    }
                >
                    <StyledItem name="parent">
                        <NodeParentSelect
                            selectedParentUrn={selectedParentUrn}
                            setSelectedParentUrn={setSelectedParentUrn}
                        />
                    </StyledItem>
                </Form.Item>
                <StyledItem
                    label={
                        <Typography.Text strong>
                            {t('common.documentation')} <OptionalWrapper>({t('common.optional')})</OptionalWrapper>
                        </Typography.Text>
                    }
                >
                    <StyledButton type="link" onClick={() => setIsDocumentationModalVisible(true)}>
                        <EditOutlined />
                        {documentation ? t('common.edit') : t('common.add')} {t('common.documentation')}
                    </StyledButton>
                    {isDocumentationModalVisible && (
                        <DescriptionModal
                            title={t('crud.addWithName', { name: t('common.documentation') })}
                            onClose={() => setIsDocumentationModalVisible(false)}
                            onSubmit={addDocumentation}
                            description={documentation}
                        />
                    )}
                </StyledItem>
                <Collapse ghost>
                    <Collapse.Panel
                        header={<Typography.Text type="secondary">{t('common.advanced')}</Typography.Text>}
                        key="1"
                    >
                        <Form.Item
                            label={
                                <Typography.Text strong>
                                    {entityRegistry.getEntityNameTrans(props.entityType, t)} {t('common.id')}
                                </Typography.Text>
                            }
                        >
                            <Typography.Paragraph>{t('entity.glossaryEntityUuidDescription')}</Typography.Paragraph>
                            <Form.Item
                                name="id"
                                rules={[
                                    () => ({
                                        validator(_, value) {
                                            if (value && validateCustomUrnId(value)) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error(t('form.enterAValidEntityId')));
                                        },
                                    }),
                                ]}
                            >
                                <Input
                                    placeholder="classification"
                                    onChange={(event) => setStagedId(event.target.value)}
                                />
                            </Form.Item>
                        </Form.Item>
                    </Collapse.Panel>
                </Collapse>
            </Form>
        </Modal>
    );
}

export default CreateGlossaryEntityModal;
