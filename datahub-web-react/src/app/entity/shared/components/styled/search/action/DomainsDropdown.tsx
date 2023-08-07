import { message, Modal } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBatchSetDomainMutation } from '../../../../../../../graphql/mutations.generated';
import { SetDomainModal } from '../../../../containers/profile/sidebar/Domain/SetDomainModal';
import ActionDropdown from './ActionDropdown';
import { handleBatchError } from '../../../../utils';

type Props = {
    urns: Array<string>;
    disabled: boolean;
    refetch?: () => void;
};

// eslint-disable-next-line
export default function DomainsDropdown({ urns, disabled = false, refetch }: Props) {
    const { t } = useTranslation();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [batchSetDomainMutation] = useBatchSetDomainMutation();

    const batchUnsetDomains = () => {
        batchSetDomainMutation({
            variables: {
                input: {
                    resources: [...urns.map((urn) => ({ resourceUrn: urn }))],
                },
            },
        })
            .then(({ errors }) => {
                if (!errors) {
                    message.success({
                        content: t('crud.success.removeWithName', { name: t('entity.type.DOMAIN', { count: 1 }) }),
                        duration: 2,
                    });
                    refetch?.();
                }
            })
            .catch((e) => {
                message.destroy();
                message.error(
                    handleBatchError(
                        urns,
                        e,
                        {
                            content: `${t('crud.error.removeAssetsWithName', {
                                name: t('entity.type.DOMAIN', { count: 1 }),
                            })}: \n ${e.message || ''}`,
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
                name={t('entity.type.DOMAIN', { count: 1 })}
                actions={[
                    {
                        title: t('crud.setWithName', { name: t('entity.type.DOMAIN', { count: 1 }) }),
                        onClick: () => {
                            setIsEditModalVisible(true);
                        },
                    },
                    {
                        title: t('crud.unsetWithName', { name: t('entity.type.DOMAIN', { count: 1 }) }),
                        onClick: () => {
                            Modal.confirm({
                                title: t('entity.unsetDomainTitle'),
                                content: t('entity.unsetDomainContent'),
                                onOk() {
                                    batchUnsetDomains();
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
                <SetDomainModal
                    urns={urns}
                    onCloseModal={() => {
                        setIsEditModalVisible(false);
                        refetch?.();
                    }}
                />
            )}
        </>
    );
}
