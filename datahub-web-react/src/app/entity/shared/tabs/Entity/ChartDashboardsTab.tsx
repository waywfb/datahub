import React from 'react';
import { useBaseEntity } from '../../EntityContext';
import { EntityType } from '../../../../../types.generated';
import { EntityList } from './components/EntityList';
import { useEntityRegistry } from '../../../../useEntityRegistry';
import { useTranslation } from 'react-i18next';

export const ChartDashboardsTab = () => {
    const entity = useBaseEntity() as any;
    const chart = entity && entity.chart;
    const dashboards = chart?.dashboards?.relationships.map((relationship) => relationship.entity);
    const entityRegistry = useEntityRegistry();
    const { t } = useTranslation();
    const totalDashboards = chart?.dashboards?.total || 0;
    const title = t('common.foundInWithNameNNumber', { count: totalDashboards, name: entityRegistry.getEntityNameTrans(EntityType.Dashboard, t, totalDashboards)});
    return <EntityList title={title} type={EntityType.Dashboard} entities={dashboards || []} />;
};
