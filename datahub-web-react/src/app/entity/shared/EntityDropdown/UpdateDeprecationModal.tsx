import React from 'react';
import { Button, DatePicker, Form, Input, message, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { useBatchUpdateDeprecationMutation } from '../../../../graphql/mutations.generated';
import { handleBatchError } from '../utils';

type Props = {
    urns: string[];
    onClose: () => void;
    refetch?: () => void;
};

export const UpdateDeprecationModal = ({ urns, onClose, refetch }: Props) => {
    const { t } = useTranslation();
    const [batchUpdateDeprecation] = useBatchUpdateDeprecationMutation();
    const [form] = Form.useForm();

    const handleClose = () => {
        form.resetFields();
        onClose();
    };

    const handleOk = async (formData: any) => {
        message.loading({ content: t('crud.updating') + '...' });
        try {
            await batchUpdateDeprecation({
                variables: {
                    input: {
                        resources: [...urns.map((urn) => ({ resourceUrn: urn }))],
                        deprecated: true,
                        note: formData.note,
                        decommissionTime: formData.decommissionTime && formData.decommissionTime.unix(),
                    },
                },
            });
            message.destroy();
            message.success({ content: t('crud.success.updateWithName', { name: t('common.deprecation') }), duration: 2 });
        } catch (e: unknown) {
            message.destroy();
            if (e instanceof Error) {
                message.error(
                    handleBatchError(
                        urns,
                        e,
                        {
                            content: `${t('crud.error.updateWithName', { name: t('common.deprecation') })}: \n ${e.message || ''}`,
                            duration: 2,
                        },
                        t,
                    ),
                );
            }
        }
        refetch?.();
        handleClose();
    };

    return (
        <Modal
            title={t('crud.addWithName', { name: t('common.deprecation') + ' ' + t('common.details') })}
            visible
            onCancel={handleClose}
            keyboard
            footer={
                <>
                    <Button onClick={handleClose} type="text">
                        {t('common.cancel')}
                    </Button>
                    <Button form="addDeprecationForm" key="submit" htmlType="submit">
                        {t('common.ok')}
                    </Button>
                </>
            }
        >
            <Form form={form} name="addDeprecationForm" onFinish={handleOk} layout="vertical">
                <Form.Item name="note" label={t('common.note')} rules={[{ whitespace: true }, { min: 0, max: 100 }]}>
                    <Input placeholder={t('crud.addWithName', { name: t('common.note') })} autoFocus />
                </Form.Item>
                <Form.Item name="decommissionTime" label={t('deprecation.decommissionDate')}>
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};
