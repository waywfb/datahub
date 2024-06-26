import { LoadingOutlined, SubnodeOutlined } from '@ant-design/icons';
import { AutoComplete, Empty } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { useEntityRegistry } from '../../useEntityRegistry';
import { useGetSearchResultsForMultipleLazyQuery } from '../../../graphql/search.generated';
import { Entity, EntityType, SearchResult } from '../../../types.generated';
import { Direction } from '../types';
import { getValidEntityTypes } from '../utils/manageLineageUtils';
import LineageEntityView from './LineageEntityView';
import EntityRegistry from '../../entity/EntityRegistry';
import { ANTD_GRAY } from '../../entity/shared/constants';

const AddEdgeWrapper = styled.div`
    padding: 15px 20px;
    display: flex;
    align-items: center;
`;

const AddLabel = styled.span`
    font-size: 12px;
    font-weight: bold;
    display: flex;
    align-items: center;
`;

const AddIcon = styled(SubnodeOutlined)`
    margin-right: 5px;
    font-size: 16px;
`;

const StyledAutoComplete = styled(AutoComplete)`
    margin-left: 10px;
    flex: 1;
`;

const LoadingWrapper = styled.div`
    padding: 8px;
    display: flex;
    justify-content: center;

    svg {
        height: 15px;
        width: 15px;
        color: ${ANTD_GRAY[8]};
    }
`;

function getPlaceholderText(validEntityTypes: EntityType[], entityRegistry: EntityRegistry, t: TFunction) {
    let placeholderText = `${t('placeholder.searchFor')} `;
    if (!validEntityTypes.length) {
        placeholderText = `${placeholderText} ${t('lineage.addEntityPlaceHolderSecondPartWhenNoLength')}`;
    } else if (validEntityTypes.length === 1) {
        placeholderText = `${placeholderText} ${entityRegistry.getCollectionNameTrans(validEntityTypes[0], t)}...`;
    } else {
        validEntityTypes.forEach((type, index) => {
            placeholderText = `${placeholderText} ${entityRegistry.getCollectionNameTrans(type, t)}${
                index !== validEntityTypes.length - 1 ? ', ' : '...'
            }`;
        });
    }
    return placeholderText;
}

export function existsInEntitiesToAdd(result: SearchResult, entitiesAlreadyAdded: Entity[]) {
    return !!entitiesAlreadyAdded.find((entity) => entity.urn === result.entity.urn);
}

interface Props {
    lineageDirection: Direction;
    setEntitiesToAdd: React.Dispatch<React.SetStateAction<Entity[]>>;
    entitiesToAdd: Entity[];
    entityUrn: string;
    entityType?: EntityType;
}

export default function AddEntityEdge({
    lineageDirection,
    setEntitiesToAdd,
    entitiesToAdd,
    entityUrn,
    entityType,
}: Props) {
    const { t } = useTranslation();
    const entityRegistry = useEntityRegistry();
    const [search, { data: searchData, loading }] = useGetSearchResultsForMultipleLazyQuery();
    const [queryText, setQueryText] = useState<string>('');

    const validEntityTypes = getValidEntityTypes(lineageDirection, entityType);

    function handleSearch(text: string) {
        setQueryText(text);
        if (text !== '') {
            search({
                variables: {
                    input: {
                        types: validEntityTypes,
                        query: text,
                        start: 0,
                        count: 15,
                    },
                },
            });
        }
    }

    function selectEntity(urn: string) {
        const selectedEntity = searchData?.searchAcrossEntities?.searchResults.find(
            (result) => result.entity.urn === urn,
        );
        if (selectedEntity) {
            setEntitiesToAdd((existingEntities) => [...existingEntities, selectedEntity.entity]);
        }
    }

    const renderSearchResult = (entity: Entity) => {
        return (
            <AutoComplete.Option value={entity.urn} key={entity.urn}>
                <LineageEntityView entity={entity} displaySearchResult />
            </AutoComplete.Option>
        );
    };

    const searchResults = searchData?.searchAcrossEntities?.searchResults
        .filter((result) => !existsInEntitiesToAdd(result, entitiesToAdd) && result.entity.urn !== entityUrn)
        .map((result) => renderSearchResult(result.entity));

    const placeholderText = getPlaceholderText(validEntityTypes, entityRegistry, t);

    return (
        <AddEdgeWrapper>
            <AddLabel>
                <AddIcon />
                Add {lineageDirection}
            </AddLabel>
            <StyledAutoComplete
                autoFocus
                showSearch
                value={queryText}
                placeholder={placeholderText}
                onSearch={handleSearch}
                onSelect={(urn: any) => selectEntity(urn)}
                filterOption={false}
                notFoundContent={
                    (queryText.length > 3 && (
                        <Empty description={t('common.notFoundWithName', { name: t('common.assets') })} />
                    )) ||
                    undefined
                }
            >
                {!searchData && loading && (
                    <AutoComplete.Option value={t('common.loading').toLowerCase()}>
                        <LoadingWrapper>
                            <LoadingOutlined />
                        </LoadingWrapper>
                    </AutoComplete.Option>
                )}
                {searchResults}
            </StyledAutoComplete>
        </AddEdgeWrapper>
    );
}
