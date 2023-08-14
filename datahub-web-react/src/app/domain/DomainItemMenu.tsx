import React from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Dropdown, Menu, message, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { EntityType } from '../../types.generated';
import { useEntityRegistry } from '../useEntityRegistry';
import { useDeleteDomainMutation } from '../../graphql/domain.generated';
import { MenuIcon } from '../entity/shared/EntityDropdown/EntityDropdown';

type Props = {
    urn: string;
    name: string;
    onDelete?: () => void;
};

export default function DomainItemMenu({ name, urn, onDelete }: Props) {
    const { t } = useTranslation();
    const entityRegistry = useEntityRegistry();
    const [deleteDomainMutation] = useDeleteDomainMutation();

    const deleteDomain = () => {
        deleteDomainMutation({
            variables: {
                urn,
            },
        })
            .then(({ errors }) => {
                if (!errors) {
                    message.success(t('crud.success.deleteWithName', { name: entityRegistry.getEntityNameTrans(EntityType.Domain, t) }));
                    onDelete?.();
                }
            })
            .catch(() => {
                message.destroy();
                message.error({ content: `${t('crud.error.deleteWithName', { name: entityRegistry.getEntityNameTrans(EntityType.Domain, t) })}: An unknown error occurred.`, duration: 3 });
            });
    };

    const onConfirmDelete = () => {
        Modal.confirm({
            title: t('crud.deleteWithName', { name: entityRegistry.getEntityNameTrans(EntityType.Domain, t) + ` '${name}'` }),
            content: t('crud.doYouWantTo.removeContentWithThisName', { name: entityRegistry.getEntityNameTrans(EntityType.Domain, t) }),
            onOk() {
                deleteDomain();
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
