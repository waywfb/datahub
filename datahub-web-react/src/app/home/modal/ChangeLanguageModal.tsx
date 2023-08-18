import React from 'react';
import { Modal, List } from 'antd';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { LANGUAGE_LIST } from '../../../conf/Global';

type Props = {
    visible: boolean;
    onClose: () => void;
};

const ListItem = styled(List.Item)`
    &&& {
        cursor: pointer;
        &:hover {
            background: #f5f5f5;
        }
    }
`;

export default function ChangeLanguageModal({ visible, onClose }: Props) {
    const { t, i18n } = useTranslation();

    const onChangeLanguage = (language: string): any => {
        if (language !== i18n.language) {
            i18n.changeLanguage(language).then();
        }
        onClose();
    };

    return (
        <Modal
            title={t('homePage.changeLanguageTitle')}
            visible={visible}
            onCancel={onClose}
            okText={t('common.save')}
            cancelText={t('common.cancel')}
        >
            <List
                bordered
                dataSource={LANGUAGE_LIST}
                renderItem={(item) => <ListItem onClick={() => onChangeLanguage(item.value)}>{item.label}</ListItem>}
            />
        </Modal>
    );
}
