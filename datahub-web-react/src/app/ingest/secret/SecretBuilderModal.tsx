import { Button, Form, Input, Modal, Typography } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEnterKeyListener } from '../../shared/useEnterKeyListener';
import { SecretBuilderState } from './types';

const NAME_FIELD_NAME = 'name';
const DESCRIPTION_FIELD_NAME = 'description';
const VALUE_FIELD_NAME = 'value';

type Props = {
    initialState?: SecretBuilderState;
    visible: boolean;
    onSubmit?: (source: SecretBuilderState, resetState: () => void) => void;
    onCancel?: () => void;
};

export const SecretBuilderModal = ({ initialState, visible, onSubmit, onCancel }: Props) => {
    const { t } = useTranslation();
    const [createButtonEnabled, setCreateButtonEnabled] = useState(false);
    const [form] = Form.useForm();

    // Handle the Enter press
    useEnterKeyListener({
        querySelectorToExecuteClick: '#createSecretButton',
    });

    function resetValues() {
        form.resetFields();
    }

    return (
        <Modal
            width={540}
            title={<Typography.Text>{t('onBoarding.ingestion.createANewSecret')}</Typography.Text>}
            visible={visible}
            onCancel={onCancel}
            zIndex={1051} // one higher than other modals - needed for managed ingestion forms
            footer={
                <>
                    <Button onClick={onCancel} type="text">
                        {t('common.cancel')}
                    </Button>
                    <Button
                        id="createSecretButton"
                        onClick={() =>
                            onSubmit?.(
                                {
                                    name: form.getFieldValue(NAME_FIELD_NAME),
                                    description: form.getFieldValue(DESCRIPTION_FIELD_NAME),
                                    value: form.getFieldValue(VALUE_FIELD_NAME),
                                },
                                resetValues,
                            )
                        }
                        disabled={!createButtonEnabled}
                    >
                        {t('common.create')}
                    </Button>
                </>
            }
        >
            <Form
                form={form}
                initialValues={initialState}
                layout="vertical"
                onFieldsChange={() =>
                    setCreateButtonEnabled(!form.getFieldsError().some((field) => field.errors.length > 0))
                }
            >
                <Form.Item label={<Typography.Text strong>{t('common.name')}</Typography.Text>}>
                    <Typography.Paragraph>{t('onBoarding.ingestion.secretNameDescription')}</Typography.Paragraph>
                    <Form.Item
                        name={NAME_FIELD_NAME}
                        rules={[
                            {
                                required: true,
                                message: t('onBoarding.ingestion.secretNameRulePlaceHolder'),
                            },
                            { whitespace: false },
                            { min: 1, max: 50 },
                            { pattern: /^[^\s\t${}\\,'"]+$/, message: t('onBoarding.ingestion.secretNameNotAllowed') },
                        ]}
                        hasFeedback
                    >
                        <Input placeholder={t('onBoarding.ingestion.secretNameInputPlaceholder')} />
                    </Form.Item>
                </Form.Item>
                <Form.Item label={<Typography.Text strong>{t('common.value')}</Typography.Text>}>
                    <Typography.Paragraph>{t('onBoarding.ingestion.secretValueDescription')}</Typography.Paragraph>
                    <Form.Item
                        name={VALUE_FIELD_NAME}
                        rules={[
                            {
                                required: true,
                                message: t('onBoarding.ingestion.secretValueRulePlaceholder'),
                            },
                            // { whitespace: true },
                            { min: 1 },
                        ]}
                        hasFeedback
                    >
                        <Input.TextArea
                            placeholder={t('onBoarding.ingestion.secretValueInputPlaceholder')}
                            autoComplete="false"
                        />
                    </Form.Item>
                </Form.Item>
                <Form.Item label={<Typography.Text strong>{t('common.description')}</Typography.Text>}>
                    <Typography.Paragraph>
                        {t('onBoarding.ingestion.secretDescriptionDescription')}
                    </Typography.Paragraph>
                    <Form.Item
                        name={DESCRIPTION_FIELD_NAME}
                        rules={[{ whitespace: true }, { min: 1, max: 500 }]}
                        hasFeedback
                    >
                        <Input.TextArea placeholder={t('onBoarding.ingestion.secretDescriptionInputPlaceholder')} />
                    </Form.Item>
                </Form.Item>
            </Form>
        </Modal>
    );
};
