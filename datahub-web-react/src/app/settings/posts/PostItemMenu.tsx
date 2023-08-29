import React from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Dropdown, Menu, message, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { MenuIcon } from '../../entity/shared/EntityDropdown/EntityDropdown';
import { useDeletePostMutation } from '../../../graphql/post.generated';

type Props = {
    urn: string;
    title: string;
    onDelete?: () => void;
};

export default function PostItemMenu({ title, urn, onDelete }: Props) {
    const { t } = useTranslation();
    const [deletePostMutation] = useDeletePostMutation();

    const deletePost = () => {
        deletePostMutation({
            variables: {
                urn,
            },
        })
            .then(({ errors }) => {
                if (!errors) {
                    message.success(t('crud.success.deleteWithName', { name: t('common.post') }));
                    onDelete?.();
                }
            })
            .catch(() => {
                message.destroy();
                message.error({ content: t('crud.error.deleteWithName', { name: t('common.post') }), duration: 3 });
            });
    };

    const onConfirmDelete = () => {
        Modal.confirm({
            title: `${t('crud.deleteWithName', { name: t('common.post') })} '${title}'`,
            content: t('crud.doYouWantTo.removeContentWithThisName', { name: t('common.post') }),
            onOk() {
                deletePost();
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
            trigger={['click']}
            overlay={
                <Menu>
                    <Menu.Item onClick={onConfirmDelete} key="delete">
                        <DeleteOutlined /> &nbsp;{t('common.delete')}
                    </Menu.Item>
                </Menu>
            }
        >
            <MenuIcon data-testid={`dropdown-menu-${urn}`} fontSize={20} />
        </Dropdown>
    );
}
