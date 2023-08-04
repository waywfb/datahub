import React from 'react';
import styled from 'styled-components';
import { DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { Dropdown, Menu, message, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDeleteQueryMutation } from '../../../../../../graphql/query.generated';

const StyledMoreOutlined = styled(MoreOutlined)`
    font-size: 14px;
`;

export type Props = {
    urn: string;
    onDeleted?: (urn: string) => void;
    index?: number;
};

export default function QueryCardDetailsMenu({ urn, onDeleted, index }: Props) {
    const { t } = useTranslation();
    const [deleteQueryMutation] = useDeleteQueryMutation();

    const deleteQuery = () => {
        deleteQueryMutation({ variables: { urn } })
            .then(({ errors }) => {
                if (!errors) {
                    message.success({
                        content: t('crud.success.deleteWithName', {name: t('common.query')}),
                        duration: 3,
                    });
                    onDeleted?.(urn);
                }
            })
            .catch(() => {
                message.destroy();
                message.error({ content: t('crud.error.deleteWithName', {name: t('common.query')}) });
            });
    };

    const confirmDeleteQuery = () => {
        Modal.confirm({
            title: t('crud.deleteWithName', {name: t('common.query')}),
            content: t('crud.doYouWantTo.deleteContentWithThisName', {name: t('common.query').toLowerCase()}),
            onOk() {
                deleteQuery();
            },
            onCancel() {},
            okText: t('common.yes'),
            cancelText: t('common.cancel'),
            maskClosable: true,
            closable: true,
        });
    };

    return (
        <Dropdown
            overlay={
                <Menu>
                    <Menu.Item key="0" onClick={confirmDeleteQuery} data-testid={`query-delete-button-${index}`}>
                        <DeleteOutlined /> &nbsp; {t('crud.delete')}
                    </Menu.Item>
                </Menu>
            }
            trigger={['click']}
        >
            <StyledMoreOutlined data-testid={`query-more-button-${index}`} />
        </Dropdown>
    );
}
