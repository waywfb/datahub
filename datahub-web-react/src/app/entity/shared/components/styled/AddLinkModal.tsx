import React, { useState } from 'react';
import { message, Modal, Button, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useEntityData, useMutationUrn } from '../../EntityContext';
import { useAddLinkMutation } from '../../../../../graphql/mutations.generated';
import analytics, { EventType, EntityActionType } from '../../../../analytics';
import { useUserContext } from '../../../../context/useUserContext';

type AddLinkProps = {
    buttonProps?: Record<string, unknown>;
    refetch?: () => Promise<any>;
};

export const AddLinkModal = ({ buttonProps, refetch }: AddLinkProps) => {
    const { t } = useTranslation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const mutationUrn = useMutationUrn();
    const user = useUserContext();
    const { entityType } = useEntityData();
    const [addLinkMutation] = useAddLinkMutation();

    const [form] = Form.useForm();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleClose = () => {
        form.resetFields();
        setIsModalVisible(false);
    };

    const handleAdd = async (formData: any) => {
        if (user?.urn) {
            try {
                await addLinkMutation({
                    variables: { input: { linkUrl: formData.url, label: formData.label, resourceUrn: mutationUrn } },
                });
                message.success({ content: t('crud.success.addWithName', { name: t('common.link') }), duration: 2 });
                analytics.event({
                    type: EventType.EntityActionEvent,
                    entityType,
                    entityUrn: mutationUrn,
                    actionType: EntityActionType.UpdateLinks,
                });
            } catch (e: unknown) {
                message.destroy();
                if (e instanceof Error) {
                    message.error({ content: `{${t('crud.error.addWithName', { name: t('common.link') })}: \n ${e.message || ''}`, duration: 3 });
                }
            }
            refetch?.();
            handleClose();
        } else {
            message.error({ content: `${t('crud.error.addWithName', 
                  { name: t('common.link') })
            }: ${t('user.noUser').toLowerCase()}`, duration: 2 });
        }
    };

    return (
        <>
            <Button icon={<PlusOutlined />} onClick={showModal} {...buttonProps}>
                {t('crud.addWithName', { name: t('common.link') })}
            </Button>
            <Modal
                title={t('crud.addWithName', { name: t('common.link') })}
                visible={isModalVisible}
                destroyOnClose
                onCancel={handleClose}
                footer={[
                    <Button type="text" onClick={handleClose}>
                        {t('common.cancel')}
                    </Button>,
                    <Button form="addLinkForm" key="submit" htmlType="submit">
                        {t('common.add')}
                    </Button>,
                ]}
            >
                <Form form={form} name="addLinkForm" onFinish={handleAdd} layout="vertical">
                    <Form.Item
                        name="url"
                        label="URL"
                        rules={[
                            {
                                required: true,
                                message: t('form.urlRequired'),
                            },
                            {
                                type: 'url',
                                warningOnly: true,
                                message: t('form.validUrlRequired'),
                            },
                        ]}
                    >
                        <Input placeholder="https://" autoFocus />
                    </Form.Item>
                    <Form.Item
                        name="label"
                        label="Label"
                        rules={[
                            {
                                required: true,
                                message: t('form.labelRequired'),
                            },
                        ]}
                    >
                        <Input placeholder={t('placeholder.shortLabelForLink')} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
