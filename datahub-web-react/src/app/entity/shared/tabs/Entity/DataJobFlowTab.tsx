import React from 'react';
import { useBaseEntity } from '../../EntityContext';
import { EntityType } from '../../../../../types.generated';
import { EntityList } from './components/EntityList';
import { useEntityRegistry } from '../../../../useEntityRegistry';
import { useTranslation } from 'react-i18next';

export const DataJobFlowTab = () => {
    const entity = useBaseEntity() as any;
    const dataJob = entity && entity.dataJob;
    const dataFlow = dataJob?.dataFlow;
    const entityRegistry = useEntityRegistry();
    const { t } = useTranslation();
    const title = t('common.partOfWithName', { name: entityRegistry.getEntityNameTrans(EntityType.DataFlow, t)});
    return <EntityList title={title} type={EntityType.DataFlow} entities={[dataFlow] || []} />;
};
