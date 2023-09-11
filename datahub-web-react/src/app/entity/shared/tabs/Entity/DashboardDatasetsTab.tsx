import React from 'react';
import { useTranslation } from 'react-i18next';
import { useBaseEntity } from '../../EntityContext';
import { EntityType } from '../../../../../types.generated';
import { EntityList } from './components/EntityList';
import { useEntityRegistry } from '../../../../useEntityRegistry';

export const DashboardDatasetsTab = () => {
    const entity = useBaseEntity() as any;
    const dashboard = entity && entity.dashboard;
    const datasets = dashboard?.datasets?.relationships.map((relationship) => relationship.entity);
    const entityRegistry = useEntityRegistry();
    const { t } = useTranslation();
    const totalDatasets = dashboard?.datasets?.total || 0;
    const title = t('common.consumesWithNameNNumber', {
        count: totalDatasets,
        name: entityRegistry.getEntityNameTrans(EntityType.Dataset, t, totalDatasets),
    });
    return <EntityList title={title} type={EntityType.Dataset} entities={datasets || []} />;
};
