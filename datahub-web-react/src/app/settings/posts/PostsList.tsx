import React, { useEffect, useState } from 'react';
import { Button, Empty, Pagination, Typography } from 'antd';
import { useLocation } from 'react-router';
import styled from 'styled-components';
import * as QueryString from 'query-string';
import { PlusOutlined } from '@ant-design/icons';
import { AlignType } from 'rc-table/lib/interface';
import { Trans, useTranslation } from 'react-i18next';
import CreatePostModal from './CreatePostModal';
import { PostColumn, PostEntry, PostListMenuColumn } from './PostsListColumns';
import { useEntityRegistry } from '../../useEntityRegistry';
import { useListPostsQuery } from '../../../graphql/post.generated';
import { scrollToTop } from '../../shared/searchUtils';
import { addToListPostCache, removeFromListPostCache } from './utils';
import { Message } from '../../shared/Message';
import TabToolbar from '../../entity/shared/components/styled/TabToolbar';
import { SearchBar } from '../../search/SearchBar';
import { StyledTable } from '../../entity/shared/components/styled/StyledTable';
import { POST_TYPE_TO_DISPLAY_TEXT } from './constants';

const PostsContainer = styled.div``;

export const PostsPaginationContainer = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 12px;
    padding-left: 16px;
    border-bottom: 1px solid;
    border-color: ${(props) => props.theme.styles['border-color-base']};
    align-items: center;
`;

const PaginationInfo = styled(Typography.Text)`
    padding: 0;
`;

const DEFAULT_PAGE_SIZE = 10;

export const PostList = () => {
    const entityRegistry = useEntityRegistry();
    const { t } = useTranslation();
    const location = useLocation();
    const params = QueryString.parse(location.search, { arrayFormat: 'comma' });
    const paramsQuery = (params?.query as string) || undefined;
    const [query, setQuery] = useState<undefined | string>(undefined);
    useEffect(() => setQuery(paramsQuery), [paramsQuery]);

    const [page, setPage] = useState(1);
    const [isCreatingPost, setIsCreatingPost] = useState(false);

    const pageSize = DEFAULT_PAGE_SIZE;
    const start = (page - 1) * pageSize;

    const { loading, error, data, client, refetch } = useListPostsQuery({
        variables: {
            input: {
                start,
                count: pageSize,
                query,
            },
        },
        fetchPolicy: query && query.length > 0 ? 'no-cache' : 'cache-first',
    });

    const totalPosts = data?.listPosts?.total || 0;
    const lastResultIndex = start + pageSize > totalPosts ? totalPosts : start + pageSize;
    const posts = data?.listPosts?.posts || [];

    const onChangePage = (newPage: number) => {
        scrollToTop();
        setPage(newPage);
    };

    const handleDelete = (urn: string) => {
        removeFromListPostCache(client, urn, page, pageSize);
        setTimeout(() => {
            refetch?.();
        }, 2000);
    };

    const allColumns = [
        {
            title: t('common.title'),
            dataIndex: '',
            key: 'title',
            sorter: (sourceA, sourceB) => {
                return sourceA.title.localeCompare(sourceB.title);
            },
            render: (record: PostEntry) => PostColumn(record.title, 200),
            width: '20%',
        },
        {
            title: t('common.description'),
            dataIndex: '',
            key: 'description',
            render: (record: PostEntry) => PostColumn(record.description || ''),
        },
        {
            title: t('common.type'),
            dataIndex: '',
            key: 'type',
            render: (record: PostEntry) => PostColumn(POST_TYPE_TO_DISPLAY_TEXT[record.contentType]),
            style: { minWidth: 100 },
            width: '10%',
        },
        {
            title: '',
            dataIndex: '',
            width: '5%',
            align: 'right' as AlignType,
            key: 'menu',
            render: PostListMenuColumn(handleDelete),
        },
    ];

    const tableData = posts.map((post) => {
        return {
            urn: post.urn,
            title: post.content.title,
            description: post.content.description,
            contentType: post.content.contentType,
        };
    });

    return (
        <>
            {!data && loading && <Message type="loading" content={`${t('common.loading')}...`} />}
            {error && <Message type="error" content={t('crud.error.loadWithName', { name: t('common.posts') })} />}
            <PostsContainer>
                <TabToolbar>
                    <Button id="posts-create-post" type="text" onClick={() => setIsCreatingPost(true)}>
                        <PlusOutlined /> {`${t('common.new')} ${t('common.post')}`}
                    </Button>
                    <SearchBar
                        initialQuery={query || ''}
                        placeholderText={t('placeholder.searchWithName', { name: t('common.posts') })}
                        suggestions={[]}
                        style={{
                            maxWidth: 220,
                            padding: 0,
                        }}
                        inputStyle={{
                            height: 32,
                            fontSize: 12,
                        }}
                        onSearch={() => null}
                        onQueryChange={(q) => setQuery(q && q.length > 0 ? q : undefined)}
                        entityRegistry={entityRegistry}
                        hideRecommendations
                    />
                </TabToolbar>
                <StyledTable
                    columns={allColumns}
                    dataSource={tableData}
                    rowKey="urn"
                    pagination={false}
                    locale={{
                        emptyText: <Empty description={t('common.noPost')} image={Empty.PRESENTED_IMAGE_SIMPLE} />,
                    }}
                />
                {totalPosts > pageSize && (
                    <PostsPaginationContainer>
                        <PaginationInfo>
                            <Trans
                                {...{
                                    i18nKey: 'search.showingIndexOfTotalPost',
                                    values: {
                                        startCount: lastResultIndex > 0 ? (page - 1) * pageSize + 1 : 0,
                                        endCount: lastResultIndex,
                                        totalCount: totalPosts,
                                    },
                                    components: { bold: <b /> },
                                }}
                            />
                        </PaginationInfo>
                        <Pagination
                            current={page}
                            pageSize={pageSize}
                            total={totalPosts}
                            showLessItems
                            onChange={onChangePage}
                            showSizeChanger={false}
                        />
                        <span />
                    </PostsPaginationContainer>
                )}
                {isCreatingPost && (
                    <CreatePostModal
                        onClose={() => setIsCreatingPost(false)}
                        onCreate={(urn, title, description) => {
                            addToListPostCache(
                                client,
                                {
                                    urn,
                                    properties: {
                                        title,
                                        description: description || null,
                                    },
                                },
                                pageSize,
                            );
                            setTimeout(() => refetch(), 2000);
                        }}
                    />
                )}
            </PostsContainer>
        </>
    );
};
