import React from 'react';
import styled from 'styled-components';
import { TFunction } from 'i18next';
import { EntityType, QuickFilter } from '../../../../types.generated';
import { IconStyleType } from '../../../entity/Entity';
import EntityRegistry from '../../../entity/EntityRegistry';

const StyledIcon = styled.img`
    width: 14px;
    height: 14px;
`;

export enum QuickFilterField {
    Platform = 'platform',
    Entity = '_entityType',
}

export function getQuickFilterDetails(quickFilter: QuickFilter, entityRegistry: EntityRegistry, t: TFunction) {
    let label = '';
    let icon: JSX.Element | null = null;
    if (quickFilter.field === QuickFilterField.Platform) {
        label = entityRegistry.getDisplayName(EntityType.DataPlatform, quickFilter.entity);
        const genericProps = entityRegistry.getGenericEntityProperties(EntityType.DataPlatform, quickFilter.entity);
        const logoUrl = genericProps?.platform?.properties?.logoUrl || '';
        if (logoUrl) {
            icon = <StyledIcon alt="icon" src={logoUrl} />;
        } else {
            icon = entityRegistry.getIcon(EntityType.DataPlatform, 14, IconStyleType.ACCENT, 'black');
        }
    } else if (quickFilter.field === QuickFilterField.Entity) {
        label = entityRegistry.getCollectionNameTrans(quickFilter.value as EntityType, t);
        icon = entityRegistry.getIcon(quickFilter.value as EntityType, 14, IconStyleType.ACCENT, 'black');
    }

    return { label, icon };
}
