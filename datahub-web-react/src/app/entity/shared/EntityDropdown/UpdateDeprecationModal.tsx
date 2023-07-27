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
        message.loading({ content: 'Updating...' });
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
            message.success({ content: 'Deprecation Updated', duration: 2 });
        } catch (e: unknown) {
            message.destroy();
            if (e instanceof Error) {
                message.error(
                    handleBatchError(
                        urns,
                        e,
                        {
                            content: `Failed to update Deprecation: \n ${e.message || ''}`,
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
            title="Add Deprecation Details"
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
                <Form.Item name="note" label="Note" rules={[{ whitespace: true }, { min: 0, max: 100 }]}>
                    <Input placeholder="Add Note" autoFocus />
                </Form.Item>
                <Form.Item name="decommissionTime" label="Decommission Date">
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};
