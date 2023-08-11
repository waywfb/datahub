import React, { useState } from 'react';
import { message, Button, Input, Modal, Typography, Form, Collapse } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCreateGroupMutation } from '../../../graphql/group.generated';
import { useEnterKeyListener } from '../../shared/useEnterKeyListener';
import { validateCustomUrnId } from '../../shared/textUtil';
import analytics, { EventType } from '../../analytics';
import { CorpGroup, EntityType } from '../../../types.generated';

type Props = {
    onClose: () => void;
    onCreate: (group: CorpGroup) => void;
};

export default function CreateGroupModal({ onClose, onCreate }: Props) {
    const { t } = useTranslation();
    const [stagedName, setStagedName] = useState('');
    const [stagedDescription, setStagedDescription] = useState('');
    const [stagedId, setStagedId] = useState<string | undefined>(undefined);
    const [createGroupMutation] = useCreateGroupMutation();
    const [createButtonEnabled, setCreateButtonEnabled] = useState(true);
    const [form] = Form.useForm();

    const onCreateGroup = () => {
        createGroupMutation({
            variables: {
                input: {
                    id: stagedId,
                    name: stagedName,
                    description: stagedDescription,
                },
            },
        })
            .then(({ data, errors }) => {
                if (!errors) {
                    analytics.event({
                        type: EventType.CreateGroupEvent,
                    });
                    message.success({
                        content: t('crud.success.createWithName', { name: t('common.group')}),
                        duration: 3,
                    });
                    // TODO: Get a full corp group back from create endpoint.
                    onCreate({
                        urn: data?.createGroup || '',
                        type: EntityType.CorpGroup,
                        name: stagedName,
                        info: {
                            description: stagedDescription,
                        },
                    });
                }
            })
            .catch((e) => {
                message.destroy();
                message.error({ content: `${t('crud.error.createWithName', { name: t('common.group')})}: \n ${e.message || ''}`, duration: 3 });
            })
            .finally(() => {
                setStagedName('');
                setStagedDescription('');
            });
        onClose();
    };

    // Handle the Enter press
    useEnterKeyListener({
        querySelectorToExecuteClick: '#createGroupButton',
    });

    return (
        <Modal
            title={t('crud.createWithName', { name: t('common.group')})}
            visible
            onCancel={onClose}
            footer={
                <>
                    <Button onClick={onClose} type="text">
                        {t('common.cancel')}
                    </Button>
                    <Button id="createGroupButton" onClick={onCreateGroup} disabled={createButtonEnabled}>
                        {t('common.create')}
                    </Button>
                </>
            }
        >
            <Form
                form={form}
                initialValues={{}}
                layout="vertical"
                onFieldsChange={() =>
                    setCreateButtonEnabled(form.getFieldsError().some((field) => field.errors.length > 0))
                }
            >
                <Form.Item label={<Typography.Text strong>{t('common.name')}</Typography.Text>}>
                    <Typography.Paragraph>Give your new group a name.</Typography.Paragraph>
                    <Form.Item
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: t('form.enterAGroupName'),
                            },
                            { whitespace: true },
                            { min: 1, max: 50 },
                        ]}
                        hasFeedback
                    >
                        <Input
                            placeholder={t('placeholder.groupName')}
                            value={stagedName}
                            onChange={(event) => setStagedName(event.target.value)}
                        />
                    </Form.Item>
                </Form.Item>
                <Form.Item label={<Typography.Text strong>{t('common.description')}</Typography.Text>}>
                    <Typography.Paragraph>An optional description for your new group.</Typography.Paragraph>
                    <Form.Item name="description" rules={[{ whitespace: true }, { min: 1, max: 500 }]} hasFeedback>
                        <Input
                            placeholder={t('placeholder.groupDescription')}
                            value={stagedDescription}
                            onChange={(event) => setStagedDescription(event.target.value)}
                        />
                    </Form.Item>
                </Form.Item>
                <Collapse ghost>
                    <Collapse.Panel header={<Typography.Text type="secondary">{t('common.advanced')}</Typography.Text>} key="1">
                        <Form.Item label={<Typography.Text strong>{t('group.groupId')}</Typography.Text>}>
                            <Typography.Paragraph>
                                {t('group.groupIdDescription')}
                            </Typography.Paragraph>
                            <Form.Item
                                name="groupId"
                                rules={[
                                    () => ({
                                        validator(_, value) {
                                            if (value && validateCustomUrnId(value)) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error(t('form.enterCorrectGroupName')));
                                        },
                                    }),
                                ]}
                            >
                                <Input
                                    placeholder="product_engineering"
                                    value={stagedId || ''}
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
