import React from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Message } from '../../shared/Message';
import { decodeUrn } from '../shared/utils';
import TagStyleEntity from '../../shared/TagStyleEntity';
import { useGetTagQuery } from '../../../graphql/tag.generated';

const PageContainer = styled.div`
    padding: 32px 100px;
`;

const LoadingMessage = styled(Message)`
    margin-top: 10%;
`;

type TagPageParams = {
    urn: string;
};

/**
 * Responsible for displaying metadata about a tag
 */
export default function TagProfile() {
    const { t } = useTranslation();
    const { urn: encodedUrn } = useParams<TagPageParams>();
    const urn = decodeUrn(encodedUrn);
    const { loading } = useGetTagQuery({ variables: { urn } });

    return (
        <PageContainer>
            {loading && <LoadingMessage type="loading" content={`${t('common.loading')}...`} />}
            <TagStyleEntity urn={urn} />
        </PageContainer>
    );
}
