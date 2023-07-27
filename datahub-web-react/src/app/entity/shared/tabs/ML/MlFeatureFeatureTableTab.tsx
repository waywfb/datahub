import React from 'react';
import { useTranslation } from 'react-i18next';
import { useBaseEntity } from '../../EntityContext';
import { EntityType } from '../../../../../types.generated';
import { EntityList } from '../Entity/components/EntityList';
import { useEntityRegistry } from '../../../../useEntityRegistry';
import { GetMlFeatureQuery } from '../../../../../graphql/mlFeature.generated';

export const FeatureTableTab = () => {
    const entity = useBaseEntity() as GetMlFeatureQuery;
    const entityRegistry = useEntityRegistry();
    const { t } = useTranslation();

    const feature = entity && entity.mlFeature;
    const featureTables = feature?.featureTables?.relationships.map((relationship) => relationship.entity);

    const title = t('common.partOfWithName', { name: entityRegistry.getEntityNameTrans(EntityType.MlfeatureTable, t) });
    return <EntityList title={title} type={EntityType.MlfeatureTable} entities={featureTables || []} />;
};
