import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { message, Button, List, Typography } from 'antd';
import { LinkOutlined, DeleteOutlined } from '@ant-design/icons';
import { Trans, useTranslation } from 'react-i18next';
import { EntityType, InstitutionalMemoryMetadata } from '../../../../../../types.generated';
import { useEntityData } from '../../../EntityContext';
import { useEntityRegistry } from '../../../../../useEntityRegistry';
import { ANTD_GRAY } from '../../../constants';
import { formatDateString } from '../../../containers/profile/utils';
import { useRemoveLinkMutation } from '../../../../../../graphql/mutations.generated';

const LinkListItem = styled(List.Item)`
    border-radius: 5px;
    > .ant-btn {
        opacity: 0;
    }
    &:hover {
        background-color: ${ANTD_GRAY[2]};
        > .ant-btn {
            opacity: 1;
        }
    }
`;

const ListOffsetIcon = styled.span`
    margin-left: -18px;
    margin-right: 6px;
`;

type LinkListProps = {
    refetch?: () => Promise<any>;
};

export const LinkList = ({ refetch }: LinkListProps) => {
    const { urn: entityUrn, entityData } = useEntityData();
    const entityRegistry = useEntityRegistry();
    const { t } = useTranslation();
    const [removeLinkMutation] = useRemoveLinkMutation();
    const links = entityData?.institutionalMemory?.elements || [];

    const handleDeleteLink = async (metadata: InstitutionalMemoryMetadata) => {
        try {
            await removeLinkMutation({
                variables: { input: { linkUrl: metadata.url, resourceUrn: metadata.associatedUrn || entityUrn } },
            });
            message.success({ content: t('crud.success.removeWithName', { name: t('common.link') }), duration: 2 });
        } catch (e: unknown) {
            message.destroy();
            if (e instanceof Error) {
                message.error({
                    content: `${t('crud.error.removeWithName', { name: t('common.link') })}: \n ${e.message || ''}`,
                    duration: 2,
                });
            }
        }
        refetch?.();
    };

    return entityData ? (
        <>
            {links.length > 0 && (
                <List
                    size="large"
                    dataSource={links}
                    renderItem={(link) => (
                        <LinkListItem
                            extra={
                                <Button onClick={() => handleDeleteLink(link)} type="text" shape="circle" danger>
                                    <DeleteOutlined />
                                </Button>
                            }
                        >
                            <List.Item.Meta
                                title={
                                    <Typography.Title level={5}>
                                        <a href={link.url} target="_blank" rel="noreferrer">
                                            <ListOffsetIcon>
                                                <LinkOutlined />
                                            </ListOffsetIcon>
                                            {link.description || link.label}
                                        </a>
                                    </Typography.Title>
                                }
                                description={
                                    <Trans
                                        {...{
                                            i18nKey: 'entity.authorNameWithLink_component',
                                            values: {
                                                timestamp: formatDateString(link.created.time),
                                                authorName: link.author.username,
                                            },
                                            components: {
                                                linkComponent: (
                                                    <Link
                                                        to={`${entityRegistry.getEntityUrl(
                                                            EntityType.CorpUser,
                                                            link.author.urn,
                                                        )}`}
                                                    />
                                                ),
                                            },
                                        }}
                                    />
                                }
                            />
                        </LinkListItem>
                    )}
                />
            )}
        </>
    ) : null;
};
