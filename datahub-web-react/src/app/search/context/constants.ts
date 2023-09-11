import { SortOrder } from '../../../types.generated';

export const RELEVANCE = 'relevance';
export const ENTITY_NAME_FIELD = '_entityName';
export const LAST_OPERATION_TIME_FIELD = 'lastOperationTime';

export const DEFAULT_SORT_OPTION = RELEVANCE;

export const SORT_OPTIONS = {
    [RELEVANCE]: { label: 'common.relevance', field: RELEVANCE, sortOrder: SortOrder.Descending },
    [`${ENTITY_NAME_FIELD}_${SortOrder.Ascending}`]: {
        label: 'common.aToZ',
        field: ENTITY_NAME_FIELD,
        sortOrder: SortOrder.Ascending,
    },
    [`${ENTITY_NAME_FIELD}_${SortOrder.Descending}`]: {
        label: 'common.zToA',
        field: ENTITY_NAME_FIELD,
        sortOrder: SortOrder.Descending,
    },
    [`${LAST_OPERATION_TIME_FIELD}_${SortOrder.Descending}`]: {
        label: 'common.lastModifiedInPlatform',
        field: LAST_OPERATION_TIME_FIELD,
        sortOrder: SortOrder.Descending,
    },
};
