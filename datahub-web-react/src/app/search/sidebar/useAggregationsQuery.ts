import { useTranslation } from 'react-i18next';
import { useAggregateAcrossEntitiesQuery } from '../../../graphql/search.generated';
import { EntityType } from '../../../types.generated';
import { GLOSSARY_ENTITY_TYPES } from '../../entity/shared/constants';
import { useEntityRegistry } from '../../useEntityRegistry';
import { ENTITY_FILTER_NAME, ORIGIN_FILTER_NAME, PLATFORM_FILTER_NAME } from '../utils/constants';
import { MAX_AGGREGATION_VALUES } from './constants';
import { useSidebarFilters } from './useSidebarFilters';

type Props = {
    facets: string[];
    skip: boolean;
};

const useAggregationsQuery = ({ facets, skip }: Props) => {
    const registry = useEntityRegistry();
    const { t } = useTranslation([]);
    const sidebarFilters = useSidebarFilters();

    const {
        data: newData,
        previousData,
        loading,
        error,
    } = useAggregateAcrossEntitiesQuery({
        skip,
        fetchPolicy: 'cache-first',
        variables: {
            input: {
                types: sidebarFilters.entityFilters,
                facets,
                orFilters: sidebarFilters.orFilters,
                viewUrn: sidebarFilters.viewUrn,
                query: sidebarFilters.query,
                searchFlags: {
                    maxAggValues: MAX_AGGREGATION_VALUES,
                },
            },
        },
    });

    // This approach of falling back to previousData is needed to avoid a full re-mount of the sidebar entities
    const data = error ? null : newData ?? previousData;
    const loaded = !!data || !!error;

    const entityAggregations = data?.aggregateAcrossEntities?.facets
        ?.find((facet) => facet.field === ENTITY_FILTER_NAME)
        ?.aggregations.filter((aggregation) => {
            const type = aggregation.value as EntityType;
            return registry.getEntity(type).isBrowseEnabled() && !GLOSSARY_ENTITY_TYPES.includes(type);
        })
        .sort((a, b) => {
            const nameA = registry.getCollectionNameTrans(a.value as EntityType, t);
            const nameB = registry.getCollectionNameTrans(b.value as EntityType, t);
            return nameA.localeCompare(nameB);
        });

    const environmentAggregations = data?.aggregateAcrossEntities?.facets
        ?.find((facet) => facet.field === ORIGIN_FILTER_NAME)
        ?.aggregations.filter((aggregation) => aggregation.count)
        .sort((a, b) => a.value.localeCompare(b.value));

    const platformAggregations = data?.aggregateAcrossEntities?.facets
        ?.find((facet) => facet.field === PLATFORM_FILTER_NAME)
        ?.aggregations.filter((aggregation) => aggregation.count)
        .sort((a, b) => {
            const nameA = a.entity ? registry.getDisplayName(EntityType.DataPlatform, a.entity) : a.value;
            const nameB = b.entity ? registry.getDisplayName(EntityType.DataPlatform, b.entity) : b.value;
            return nameA.localeCompare(nameB);
        });

    return {
        loading,
        loaded,
        error,
        entityAggregations,
        environmentAggregations,
        platformAggregations,
    } as const;
};

export default useAggregationsQuery;
