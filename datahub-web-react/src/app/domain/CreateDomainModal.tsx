import React, { useState } from 'react';
import styled from 'styled-components';
import { message, Button, Input, Modal, Typography, Form, Collapse, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { EntityType } from '../../types.generated';
import { useCreateDomainMutation } from '../../graphql/domain.generated';
import { useEnterKeyListener } from '../shared/useEnterKeyListener';
import { validateCustomUrnId } from '../shared/textUtil';
import analytics, { EventType } from '../analytics';
import { useEntityRegistry } from '../useEntityRegistry';

const SuggestedNamesGroup = styled.div`
    margin-top: 12px;
`;

const ClickableTag = styled(Tag)`
    :hover {
        cursor: pointer;
    }
`;

type Props = {
    onClose: () => void;
    onCreate: (urn: string, id: string | undefined, name: string, description: string | undefined) => void;
};

const SUGGESTED_DOMAIN_NAMES = ['Engineering', 'Marketing', 'Sales', 'Product'];

const ID_FIELD_NAME = 'id';
const NAME_FIELD_NAME = 'name';
const DESCRIPTION_FIELD_NAME = 'description';

export default function CreateDomainModal({ onClose, onCreate }: Props) {
    const entityRegistry = useEntityRegistry();
    const { t } = useTranslation();
    const [createDomainMutation] = useCreateDomainMutation();
    const [createButtonEnabled, setCreateButtonEnabled] = useState(false);
    const [form] = Form.useForm();

    const onCreateDomain = () => {
        createDomainMutation({
            variables: {
                input: {
                    id: form.getFieldValue(ID_FIELD_NAME),
                    name: form.getFieldValue(NAME_FIELD_NAME),
                    description: form.getFieldValue(DESCRIPTION_FIELD_NAME),
                },
            },
        })
            .then(({ data, errors }) => {
                if (!errors) {
                    analytics.event({
                        type: EventType.CreateDomainEvent,
                    });
                    message.success({
                        content: t('crud.success.createWithName', {
                            name: entityRegistry.getEntityNameTrans(EntityType.Domain, t),
                        }),
                        duration: 3,
                    });
                    onCreate(
                        data?.createDomain || '',
                        form.getFieldValue(ID_FIELD_NAME),
                        form.getFieldValue(NAME_FIELD_NAME),
                        form.getFieldValue(DESCRIPTION_FIELD_NAME),
                    );
                    form.resetFields();
                }
            })
            .catch((e) => {
                message.destroy();
                message.error({
                    content: `${t('crud.error.createWithName', {
                        name: entityRegistry.getEntityNameTrans(EntityType.Domain, t),
                    })}: \n ${e.message || ''}`,
                    duration: 3,
                });
            });
        onClose();
    };

    // Handle the Enter press
    useEnterKeyListener({
        querySelectorToExecuteClick: '#createDomainButton',
    });

    return (
        <Modal
            title={t('crud.createWithName', { name: entityRegistry.getEntityNameTrans(EntityType.Domain, t) })}
            visible
            onCancel={onClose}
            footer={
                <>
                    <Button onClick={onClose} type="text">
                        {t('common.cancel')}
                    </Button>
                    <Button
                        id="createDomainButton"
                        data-testid="create-domain-button"
                        onClick={onCreateDomain}
                        disabled={!createButtonEnabled}
                    >
                        {t('common.create')}
                    </Button>
                </>
            }
        >
            <Form
                form={form}
                initialValues={{}}
                layout="vertical"
                onFieldsChange={() => {
                    setCreateButtonEnabled(!form.getFieldsError().some((field) => field.errors.length > 0));
                }}
            >
                <Form.Item label={<Typography.Text strong>{t('common.name')}</Typography.Text>}>
                    <Typography.Paragraph>{t('form.giveYourNewDomainAName')}</Typography.Paragraph>
                    <Form.Item
                        name={NAME_FIELD_NAME}
                        rules={[
                            {
                                required: true,
                                message: t('form.enterANameWithName', {
                                    name: entityRegistry.getEntityNameTrans(EntityType.Domain, t),
                                }),
                            },
                            { whitespace: true },
                            { min: 1, max: 150 },
                        ]}
                        hasFeedback
                    >
                        <Input data-testid="create-domain-name" placeholder={t('placeholder.domainName')} />
                    </Form.Item>
                    <SuggestedNamesGroup>
                        {SUGGESTED_DOMAIN_NAMES.map((name) => {
                            return (
                                <ClickableTag
                                    key={name}
                                    onClick={() => {
                                        form.setFieldsValue({
                                            name,
                                        });
                                        setCreateButtonEnabled(true);
                                    }}
                                >
                                    {name}
                                </ClickableTag>
                            );
                        })}
                    </SuggestedNamesGroup>
                </Form.Item>
                <Form.Item label={<Typography.Text strong>{t('common.description')}</Typography.Text>}>
                    <Typography.Paragraph>{t('domain.domainDescriptionDescription')}</Typography.Paragraph>
                    <Form.Item
                        name={DESCRIPTION_FIELD_NAME}
                        rules={[{ whitespace: true }, { min: 1, max: 500 }]}
                        hasFeedback
                    >
                        <Input.TextArea placeholder={t('placeholder.domainDescription')} />
                    </Form.Item>
                </Form.Item>
                <Collapse ghost>
                    <Collapse.Panel
                        header={<Typography.Text type="secondary">{t('common.advanced')}</Typography.Text>}
                        key="1"
                    >
                        <Form.Item
                            label={
                                <Typography.Text strong>
                                    {entityRegistry.getEntityNameTrans(EntityType.Domain, t)} {t('common.id')}
                                </Typography.Text>
                            }
                        >
                            <Typography.Paragraph>{t('domain.domainIdDescription')}</Typography.Paragraph>
                            <Form.Item
                                name={ID_FIELD_NAME}
                                rules={[
                                    () => ({
                                        validator(_, value) {
                                            if (value && validateCustomUrnId(value)) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error(t('form.enterValidDomainId')));
                                        },
                                    }),
                                ]}
                            >
                                <Input data-testid="create-domain-id" placeholder="engineering" />
                            </Form.Item>
                        </Form.Item>
                    </Collapse.Panel>
                </Collapse>
            </Form>
        </Modal>
    );
}
