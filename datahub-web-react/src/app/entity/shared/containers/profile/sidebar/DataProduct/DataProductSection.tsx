import { EditOutlined } from '@ant-design/icons';
import { Button, Modal, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { SidebarHeader } from '../SidebarHeader';
import { useEntityData } from '../../../../EntityContext';
import SetDataProductModal from './SetDataProductModal';
import { DataProductLink } from '../../../../../../shared/tags/DataProductLink';
import { useBatchSetDataProductMutation } from '../../../../../../../graphql/dataProduct.generated';
import { DataProduct } from '../../../../../../../types.generated';

const EmptyText = styled(Typography.Paragraph)`
    &&& {
        border-top: none;
        padding-top: 0;
    }
`;

interface Props {
    readOnly?: boolean;
}

export default function DataProductSection({ readOnly }: Props) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { entityData, urn } = useEntityData();
    const { t } = useTranslation(['translation', 'empty-message']);
    const [batchSetDataProductMutation] = useBatchSetDataProductMutation();
    const [dataProduct, setDataProduct] = useState<DataProduct | null>(null);
    const dataProductRelationships = entityData?.dataProduct?.relationships;
    const siblingUrns: string[] = entityData?.siblings?.siblings?.map((sibling) => sibling?.urn || '') || [];

    useEffect(() => {
        if (dataProductRelationships && dataProductRelationships.length > 0) {
            setDataProduct(dataProductRelationships[0].entity as DataProduct);
        }
    }, [dataProductRelationships]);

    function removeDataProduct() {
        batchSetDataProductMutation({ variables: { input: { resourceUrns: [urn, ...siblingUrns] } } })
            .then(() => {
                message.success({
                    content: t('crud.success.removeWithName', { name: t('common.dataProduct') }),
                    duration: 2,
                });
                setDataProduct(null);
            })
            .catch((e: unknown) => {
                message.destroy();
                if (e instanceof Error) {
                    message.error({
                        content: t('crud.error.removeWithName', { name: t('common.dataProduct') }),
                        duration: 3,
                    });
                }
            });
    }

    const onRemoveDataProduct = () => {
        Modal.confirm({
            title: t('crud.doYouWantTo.confirmRemovalWithName', { name: t('common.dataProduct') }),
            content: t('crud.doYouWantTo.removeContentWithThisName', { name: t('common.dataProduct') }),
            onOk() {
                removeDataProduct();
            },
            onCancel() {},
            okText: t('common.yes'),
            cancelText: t('common.cancel'),
            maskClosable: true,
            closable: true,
        });
    };

    return (
        <>
            <SidebarHeader title={t('common.dataProduct')} />
            {dataProduct && (
                <DataProductLink
                    dataProduct={dataProduct}
                    closable={!readOnly}
                    readOnly={readOnly}
                    onClose={(e) => {
                        e.preventDefault();
                        onRemoveDataProduct();
                    }}
                    fontSize={12}
                />
            )}
            {!dataProduct && (
                <>
                    <EmptyText type="secondary">
                        {t('dataProduct.title', { ns: 'empty-message' })}.{' '}
                        {t('dataProduct.description', { ns: 'empty-message' })}
                    </EmptyText>
                    {!readOnly && (
                        <Button type="default" onClick={() => setIsModalVisible(true)}>
                            <EditOutlined /> {t('crud.setWithName', { name: t('common.dataProduct') })}
                        </Button>
                    )}
                </>
            )}
            {isModalVisible && (
                <SetDataProductModal
                    urns={[urn, ...siblingUrns]}
                    currentDataProduct={dataProduct || null}
                    onModalClose={() => setIsModalVisible(false)}
                    setDataProduct={setDataProduct}
                />
            )}
        </>
    );
}
