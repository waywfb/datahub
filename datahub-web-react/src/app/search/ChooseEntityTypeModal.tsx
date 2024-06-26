import { Button, Modal, Select } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EntityType } from '../../types.generated';
import { useEntityRegistry } from '../useEntityRegistry';

type Props = {
    onCloseModal: () => void;
    onOk?: (results: string[]) => void;
    title?: string;
    defaultValues?: string[];
};

const { Option } = Select;

export const ChooseEntityTypeModal = ({ defaultValues, onCloseModal, onOk, title }: Props) => {
    const entityRegistry = useEntityRegistry();
    const { t } = useTranslation();
    const entityTypes = entityRegistry.getSearchEntityTypes();

    const [stagedValues, setStagedValues] = useState(defaultValues || []);

    const addEntityType = (newType) => {
        setStagedValues([...stagedValues, newType]);
    };

    const removeEntityType = (type) => {
        setStagedValues(stagedValues.filter((stagedValue) => stagedValue !== type));
    };

    return (
        <Modal
            title={title}
            visible
            onCancel={onCloseModal}
            keyboard
            footer={
                <>
                    <Button onClick={onCloseModal} type="text">
                        {t('common.cancel')}
                    </Button>
                    <Button disabled={stagedValues.length === 0} onClick={() => onOk?.(stagedValues)}>
                        {t('common.done')}
                    </Button>
                </>
            }
        >
            <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder={t('placeholder.datasetsDashboardsChartsAndMore')}
                onSelect={(newValue) => addEntityType(newValue)}
                onDeselect={(newValue) => removeEntityType(newValue)}
                value={stagedValues.map((stagedEntityType) => ({
                    value: stagedEntityType,
                    label: entityRegistry.getCollectionNameTrans(stagedEntityType as EntityType, t),
                }))}
                dropdownMatchSelectWidth={false}
            >
                {entityTypes.map((type) => (
                    <Option key={type} value={type}>
                        {entityRegistry.getCollectionNameTrans(type, t)}
                    </Option>
                ))}
            </Select>
        </Modal>
    );
};
