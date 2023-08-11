import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { UnionType } from '../../search/utils/constants';
import { EmbeddedListSearchSection } from '../shared/components/styled/search/EmbeddedListSearchSection';

const GroupAssetsWrapper = styled.div`
    height: calc(100vh - 114px);
`;

type Props = {
    urn: string;
};

export const GroupAssets = ({ urn }: Props) => {
    const { t } = useTranslation();
    return (
        <GroupAssetsWrapper>
            <EmbeddedListSearchSection
                skipCache
                fixedFilters={{
                    unionType: UnionType.AND,
                    filters: [{ field: 'owners', values: [urn] }],
                }}
                emptySearchQuery="*"
                placeholderText={t('placeholder.filterWithName', { name: t('common.entities') })}
            />
        </GroupAssetsWrapper>
    );
};
