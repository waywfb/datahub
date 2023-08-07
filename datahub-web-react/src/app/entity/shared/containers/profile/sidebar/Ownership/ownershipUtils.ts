import { OwnershipType, OwnershipTypeEntity } from '../../../../../../../types.generated';
import { TFunction } from 'i18next';

/**
 * A mapping from OwnershipType to it's display name & description. In the future,
 * we intend to make this configurable.
 */
export const OWNERSHIP_DISPLAY_TYPES = [
    {
        type: OwnershipType.TechnicalOwner,
        name: 'ownerType.TECHNICAL_OWNER.name',
        description: 'ownerType.TECHNICAL_OWNER.description',
    },
    {
        type: OwnershipType.BusinessOwner,
        name: 'ownerType.BUSINESS_OWNER.name',
        description: 'ownerType.BUSINESS_OWNER.description',
    },
    {
        type: OwnershipType.DataSteward,
        name: 'ownerType.DATA_STEWARD.name',
        description: 'ownerType.DATA_STEWARD.description',
    },
    {
        type: OwnershipType.None,
        name: 'ownerType.NONE.name',
        description: 'ownerType.NONE.description',
    },
];

const ownershipTypeToDetails = new Map();
OWNERSHIP_DISPLAY_TYPES.forEach((ownershipDetails) => {
    ownershipTypeToDetails.set(ownershipDetails.type, ownershipDetails);
});

export const getNameFromType = (t: TFunction, type: OwnershipType) => {
    return ownershipTypeToDetails.get(type)?.name ? t(ownershipTypeToDetails.get(type)?.name) : type;
};

export const getDescriptionFromType = (t: TFunction, type: OwnershipType) => {
    return ownershipTypeToDetails.get(type)?.description ? t(ownershipTypeToDetails.get(type)?.description) : t('common.noDescription');
};

export function getOwnershipTypeName(t: TFunction, ownershipType?: OwnershipTypeEntity | null) {
    return ownershipType?.info?.name ? t(ownershipType?.info?.name) : t('common.other');
}
