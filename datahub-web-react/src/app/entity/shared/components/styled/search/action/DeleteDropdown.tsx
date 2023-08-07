import { message, Modal } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useBatchUpdateSoftDeletedMutation } from '../../../../../../../graphql/mutations.generated';
import ActionDropdown from './ActionDropdown';
import { handleBatchError } from '../../../../utils';

type Props = {
    urns: Array<string>;
    disabled: boolean;
    refetch?: () => void;
};

// eslint-disable-next-line
export default function DeleteDropdown({ urns, disabled = false, refetch }: Props) {
    const { t } = useTranslation();
    const [batchUpdateSoftDeletedMutation] = useBatchUpdateSoftDeletedMutation();

    const batchSoftDelete = () => {
        batchUpdateSoftDeletedMutation({
            variables: {
                input: {
                    urns,
                    deleted: true,
                },
            },
        })
            .then(({ errors }) => {
                if (!errors) {
                    message.success({
                        content: t('crud.success.deleteWithName', { name: t('common.assets') }),
                        duration: 2,
                    });
                    setTimeout(() => refetch?.(), 3000);
                }
            })
            .catch((e) => {
                message.destroy();
                message.error(
                    handleBatchError(
                        urns,
                        e,
                        {
                            content: `${t('crud.error.deleteWithName', { name: t('common.assets') })}: \n ${
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
                name={t('common.delete')}
                actions={[
                    {
                        title: 'Mark as deleted',
                        onClick: () => {
                            Modal.confirm({
                                title: t('crud.doYouWantTo.confirmDelete'),
                                content: t('entity.deleteAssetMessageConfirmation'),
                                onOk() {
                                    batchSoftDelete();
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
        </>
    );
}
