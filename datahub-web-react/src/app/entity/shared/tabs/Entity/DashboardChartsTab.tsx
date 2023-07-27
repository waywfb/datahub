import React from 'react';
import { useBaseEntity } from '../../EntityContext';
import { EntityType } from '../../../../../types.generated';
import { EntityList } from './components/EntityList';
import { useEntityRegistry } from '../../../../useEntityRegistry';
import { useTranslation } from 'react-i18next';

export const DashboardChartsTab = () => {
    const entity = useBaseEntity() as any;
    const dashboard = entity && entity.dashboard;
    const charts = dashboard?.charts?.relationships.map((relationship) => relationship.entity);
    const entityRegistry = useEntityRegistry();
    const { t } = useTranslation();
    const totalCharts = dashboard?.charts?.total || 0;
    const title = t('common.containsWithNameNNumber', { count: totalCharts, name: entityRegistry.getEntityNameTrans(EntityType.Chart, t, totalCharts)});
    return <EntityList title={title} type={EntityType.Chart} entities={charts || []} />;
};
