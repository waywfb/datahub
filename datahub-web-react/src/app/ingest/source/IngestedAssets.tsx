import { Button, Typography } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useGetSearchResultsForMultipleQuery } from '../../../graphql/search.generated';
import { EmbeddedListSearchModal } from '../../entity/shared/components/styled/search/EmbeddedListSearchModal';
import { ANTD_GRAY } from '../../entity/shared/constants';
import { UnionType } from '../../search/utils/constants';
import { formatNumber } from '../../shared/formatNumber';
import { Message } from '../../shared/Message';
import { useEntityRegistry } from '../../useEntityRegistry';
import { extractEntityTypeCountsFromFacets } from './utils';

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const TitleContainer = styled.div``;

const TotalContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: right;
    align-items: end;
`;

const TotalText = styled(Typography.Text)`
    font-size: 16px;
    color: ${ANTD_GRAY[8]};
`;

const EntityCountsContainer = styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
    max-width: 100%;
    flex-wrap: wrap;
`;

const EntityCount = styled.div`
    margin-right: 40px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const ViewAllButton = styled(Button)`
    padding: 0;
    margin-top: 4px;
`;

type Props = {
    id: string;
};

const ENTITY_FACET_NAME = 'entity';
const TYPE_NAMES_FACET_NAME = 'typeNames';

export default function IngestedAssets({ id }: Props) {
    const { t } = useTranslation();
    const entityRegistry = useEntityRegistry();

    // First thing to do is to search for all assets with the id as the run id!
    const [showAssetSearch, setShowAssetSearch] = useState(false);

    // Execute search
    const { data, loading, error } = useGetSearchResultsForMultipleQuery({
        variables: {
            input: {
                query: '*',
                start: 0,
                count: 1,
                filters: [
                    {
                        field: 'runId',
                        values: [id],
                    },
                ],
            },
        },
        fetchPolicy: 'cache-first',
    });

    // Parse filter values to get results.
    const facets = data?.searchAcrossEntities?.facets;

    // Extract facets to construct the per-entity type breakdown stats
    const hasEntityTypeFacet = (facets || []).findIndex((facet) => facet.field === ENTITY_FACET_NAME) >= 0;
    const entityTypeFacets =
        (hasEntityTypeFacet && facets?.filter((facet) => facet.field === ENTITY_FACET_NAME)[0]) || undefined;
    const hasSubTypeFacet = (facets || []).findIndex((facet) => facet.field === TYPE_NAMES_FACET_NAME) >= 0;
    const subTypeFacets =
        (hasSubTypeFacet && facets?.filter((facet) => facet.field === TYPE_NAMES_FACET_NAME)[0]) || undefined;
    const countsByEntityType =
        (entityTypeFacets && extractEntityTypeCountsFromFacets(t, entityRegistry, entityTypeFacets, subTypeFacets)) ||
        [];

    // The total number of assets ingested
    const total = data?.searchAcrossEntities?.total || 0;

    return (
        <>
            {error && <Message type="error" content="" />}
            <HeaderContainer>
                <TitleContainer>
                    <Typography.Title level={5}>{t('ingest.ingestedAssets')}</Typography.Title>
                    {(loading && <Typography.Text type="secondary">{`${t('common.loading')}...`}</Typography.Text>) || (
                        <>
                            {(total > 0 && (
                                <Typography.Paragraph type="secondary">
                                    {t('ingest.theFollowingAssetTypesWereIngestedDuringThisRun')}
                                </Typography.Paragraph>
                            )) || <Typography.Text>{t('ingest.noAssetsWereIngested')}</Typography.Text>}
                        </>
                    )}
                </TitleContainer>
                {!loading && (
                    <TotalContainer>
                        <Typography.Text type="secondary">{t('common.total')}</Typography.Text>
                        <TotalText style={{ fontSize: 16, color: ANTD_GRAY[8] }}>
                            <b>{formatNumber(total)}</b> {t('common.assets').toLowerCase()}
                        </TotalText>
                    </TotalContainer>
                )}
            </HeaderContainer>
            <EntityCountsContainer>
                {countsByEntityType.map((entityCount) => (
                    <EntityCount>
                        <Typography.Text style={{ paddingLeft: 2, fontSize: 18, color: ANTD_GRAY[8] }}>
                            <b>{formatNumber(entityCount.count)}</b>
                        </Typography.Text>
                        <Typography.Text type="secondary">{entityCount.displayName}</Typography.Text>
                    </EntityCount>
                ))}
            </EntityCountsContainer>
            <ViewAllButton type="link" onClick={() => setShowAssetSearch(true)}>
                {t('common.viewAll')}
            </ViewAllButton>
            {showAssetSearch && (
                <EmbeddedListSearchModal
                    title={t('ingest.viewIngestedAssets')}
                    searchBarStyle={{ width: 600, marginRight: 40 }}
                    fixedFilters={{
                        unionType: UnionType.AND,
                        filters: [{ field: 'runId', values: [id] }],
                    }}
                    onClose={() => setShowAssetSearch(false)}
                />
            )}
        </>
    );
}
