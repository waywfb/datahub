import React from 'react';
import { Modal, Button } from 'antd';
import { useTranslation } from 'react-i18next';

type Props = {
    cancelModalVisible?: boolean;
    onDiscard?: () => void;
    onCancel?: () => void;
};

export const DiscardDescriptionModal = ({ cancelModalVisible, onDiscard, onCancel }: Props) => {
    const { t } = useTranslation();
    return (
        <>
            <Modal
                title="Exit Editor"
                visible={cancelModalVisible}
                destroyOnClose
                onCancel={onCancel}
                footer={[
                    <Button type="text" onClick={onCancel}>
                        {t('common.cancel')}
                    </Button>,
                    <Button onClick={onDiscard}>{t('common.yes')}</Button>,
                ]}
            >
                <p>Are you sure you want to close the documentation editor? Any unsaved changes will be lost.</p>
            </Modal>
        </>
    );
};
