import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useEntityData } from '../entity/shared/EntityContext';
import { useEntityRegistry } from '../useEntityRegistry';
import { capitalizeFirstLetterOnly } from './textUtil';

export const EntityHead = () => {
    const entityRegistry = useEntityRegistry();
    const { entityType, entityData } = useEntityData();
    const { t } = useTranslation();

    if (!entityData) {
        return null;
    }

    const entityDisplayName = entityRegistry.getDisplayName(entityType, entityData);
    const type =
        capitalizeFirstLetterOnly(entityData?.subTypes?.typeNames?.[0]) ||
        entityRegistry.getEntityNameTrans(entityType, t);

    return (
        <Helmet>
            <title>
                {entityDisplayName} | {type}
            </title>
        </Helmet>
    );
};
