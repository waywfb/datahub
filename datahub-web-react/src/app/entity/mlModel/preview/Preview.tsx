import React from 'react';
import { EntityType, MlModel } from '../../../../types.generated';
import DefaultPreviewCard from '../../../preview/DefaultPreviewCard';
import { capitalizeFirstLetterOnly } from '../../../shared/textUtil';
import { useEntityRegistry } from '../../../useEntityRegistry';
import { IconStyleType } from '../../Entity';
import { getDataProduct } from '../../shared/utils';
import { useTranslation } from 'react-i18next';

export const Preview = ({ model }: { model: MlModel }): JSX.Element => {
    const entityRegistry = useEntityRegistry();
    const { t } = useTranslation();
    const genericProperties = entityRegistry.getGenericEntityProperties(EntityType.Mlmodel, model);

    return (
        <DefaultPreviewCard
            url={entityRegistry.getEntityUrl(EntityType.Mlmodel, model.urn)}
            name={model.name || ''}
            urn={model.urn}
            description={model.description || ''}
            platformInstanceId={model.dataPlatformInstance?.instanceId}
            type={entityRegistry.getEntityNameTrans(EntityType.Mlmodel, t)}
            typeIcon={entityRegistry.getIcon(EntityType.Mlmodel, 14, IconStyleType.ACCENT)}
            platform={model?.platform?.properties?.displayName || capitalizeFirstLetterOnly(model?.platform?.name)}
            qualifier={model.origin}
            tags={model.globalTags || undefined}
            owners={model?.ownership?.owners}
            dataProduct={getDataProduct(genericProperties?.dataProduct)}
        />
    );
};
