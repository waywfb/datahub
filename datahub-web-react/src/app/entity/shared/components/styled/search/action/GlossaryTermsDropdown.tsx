import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EntityType } from '../../../../../../../types.generated';
import EditTagTermsModal, { OperationType } from '../../../../../../shared/tags/AddTagsTermsModal';
import ActionDropdown from './ActionDropdown';

type Props = {
    urns: Array<string>;
    disabled: boolean;
    refetch?: () => void;
};

// eslint-disable-next-line
export default function GlossaryTermsDropdown({ urns, disabled = false, refetch }: Props) {
    const { t } = useTranslation();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [operationType, setOperationType] = useState(OperationType.ADD);

    return (
        <>
            <ActionDropdown
                name={t('entity.type.GLOSSARY_TERM_interval', { postProcess: 'interval', count: 2 })}
                actions={[
                    {
                        title: t('crud.addWithName', {
                            name: t('entity.type.GLOSSARY_TERM_interval', { postProcess: 'interval', count: 2 }),
                        }),
                        onClick: () => {
                            setOperationType(OperationType.ADD);
                            setIsEditModalVisible(true);
                        },
                    },
                    {
                        title: t('crud.removeWithName', {
                            name: t('entity.type.TAG_interval', { postProcess: 'interval', count: 2 }),
                        }),
                        onClick: () => {
                            setOperationType(OperationType.REMOVE);
                            setIsEditModalVisible(true);
                        },
                    },
                ]}
                disabled={disabled}
            />
            {isEditModalVisible && (
                <EditTagTermsModal
                    type={EntityType.GlossaryTerm}
                    visible
                    onCloseModal={() => {
                        setIsEditModalVisible(false);
                        refetch?.();
                    }}
                    resources={urns.map((urn) => ({
                        resourceUrn: urn,
                    }))}
                    operationType={operationType}
                />
            )}
        </>
    );
}
