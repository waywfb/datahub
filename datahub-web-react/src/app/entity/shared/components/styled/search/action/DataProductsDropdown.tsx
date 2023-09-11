import { message, Modal } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ActionDropdown from './ActionDropdown';
import { handleBatchError } from '../../../../utils';
import { useBatchSetDataProductMutation } from '../../../../../../../graphql/dataProduct.generated';
import SetDataProductModal from '../../../../containers/profile/sidebar/DataProduct/SetDataProductModal';

type Props = {
    urns: Array<string>;
    disabled: boolean;
    refetch?: () => void;
};

// eslint-disable-next-line
export default function DataProductsDropdown({ urns, disabled = false, refetch }: Props) {
    const { t } = useTranslation();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [batchSetDataProductMutation] = useBatchSetDataProductMutation();

    const batchUnsetDataProducts = () => {
        batchSetDataProductMutation({
            variables: {
                input: {
                    resourceUrns: urns,
                },
            },
        })
            .then(({ errors }) => {
                if (!errors) {
                    message.loading({ content: `${t('common.loading')}...`, duration: 2 });
                    setTimeout(() => {
                        message.success({
                            content: t('crud.success.removeWithName', { name: t('common.dataProduct') }),
                            duration: 2,
                        });
                        refetch?.();
                    }, 2000);
                }
            })
            .catch((e) => {
                message.destroy();
                message.error(
                    handleBatchError(
                        urns,
                        e,
                        {
                            content: `${t('crud.error.removeAssetsWithName', { name: t('common.dataProduct') })}: \n ${
                                e.message || ''
                            }`,
                            duration: 3,
                        },
                        t,
                    ),
                );
            });
    };

    return (
        <>
            <ActionDropdown
                name={t('common.dataProduct')}
                actions={[
                    {
                        title: t('crud.setWithName', { name: t('common.dataProduct') }),
                        onClick: () => {
                            setIsEditModalVisible(true);
                        },
                    },
                    {
                        title: t('crud.unsetWithName', { name: t('common.dataProduct') }),
                        onClick: () => {
                            Modal.confirm({
                                title: t('entity.unsetDataProductTitle'),
                                content: t('entity.unsetDataProductContent'),
                                onOk() {
                                    batchUnsetDataProducts();
                                },
                                onCancel() {},
                                okText: t('common.yes'),
                                cancelText: t('common.cancel'),
                                maskClosable: true,
                                closable: true,
                            });
                        },
                    },
                ]}
                disabled={disabled}
            />
            {isEditModalVisible && (
                <SetDataProductModal
                    urns={urns}
                    currentDataProduct={null}
                    onModalClose={() => {
                        setIsEditModalVisible(false);
                    }}
                    refetch={refetch}
                />
            )}
        </>
    );
}
