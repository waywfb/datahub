import React from 'react';
import styled from 'styled-components';
import { UnionType } from '../../search/utils/constants';
import { EmbeddedListSearchSection } from '../shared/components/styled/search/EmbeddedListSearchSection';
import { useTranslation } from 'react-i18next';

const UserAssetsWrapper = styled.div`
    height: calc(100vh - 114px);
    overflow: auto;
`;

type Props = {
    urn: string;
};

export const UserAssets = ({ urn }: Props) => {
    const { t } = useTranslation();

    return (
        <UserAssetsWrapper>
            <EmbeddedListSearchSection
                skipCache
                fixedFilters={{
                    unionType: UnionType.AND,
                    filters: [{ field: 'owners', values: [urn] }],
                }}
                emptySearchQuery="*"
                placeholderText={t('placeholder.filterWithName', { name: t('common.entities') })}
            />
        </UserAssetsWrapper>
    );
};
