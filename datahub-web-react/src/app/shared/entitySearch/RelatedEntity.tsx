import React from 'react';
import { List, Typography, Divider } from 'antd';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useEntityRegistry } from '../../useEntityRegistry';
import { PreviewType } from '../../entity/Entity';
import { EntityType, SearchResult } from '../../../types.generated';

type Props = {
    searchResult: {
        [key in EntityType]?: Array<SearchResult>;
    };
    entityPath?: string;
};

const ListContainer = styled.div`
    display: default;
    flex-grow: default;
`;

const TitleContainer = styled.div`
    margin-bottom: 30px;
`;

export default ({ searchResult, entityPath }: Props) => {
    const entityRegistry = useEntityRegistry();
    const { t } = useTranslation();
    const entityType = entityRegistry.getTypeFromPathName(entityPath || '');
    if (!entityType) return null;

    const entitiesToShow = searchResult[entityType] || [];

    return (
        <ListContainer>
            <TitleContainer>
                <Typography.Title level={3}>{entityRegistry.getCollectionNameTrans(entityType, t)}</Typography.Title>
                <Divider />
            </TitleContainer>
            <List
                dataSource={entitiesToShow}
                renderItem={(item) => {
                    return (
                        <>
                            {entityRegistry.renderPreview(entityType, PreviewType.PREVIEW, item.entity)}
                            <Divider />
                        </>
                    );
                }}
            />
        </ListContainer>
    );
};
