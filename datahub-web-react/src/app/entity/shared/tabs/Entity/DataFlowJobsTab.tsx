import React from 'react';
import { useTranslation } from 'react-i18next';
import { useBaseEntity } from '../../EntityContext';
import { EntityType } from '../../../../../types.generated';
import { EntityList } from './components/EntityList';
import { useEntityRegistry } from '../../../../useEntityRegistry';

export const DataFlowJobsTab = () => {
    const entity = useBaseEntity() as any;
    const dataFlow = entity && entity.dataFlow;
    const dataJobs = dataFlow?.childJobs?.relationships.map((relationship) => relationship.entity);
    const entityRegistry = useEntityRegistry();
    const { t } = useTranslation();
    const totalJobs = dataFlow?.childJobs?.total || 0;
    const title = t('common.containsWithNameNNumber', {
        count: totalJobs,
        name: entityRegistry.getEntityNameTrans(EntityType.DataJob, t, totalJobs),
    });
    return <EntityList title={title} type={EntityType.DataJob} entities={dataJobs || []} />;
};
