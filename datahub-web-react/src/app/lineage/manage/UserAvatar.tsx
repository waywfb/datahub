import { PartitionOutlined } from '@ant-design/icons';
import { Avatar, Popover } from 'antd';
import React from 'react';
import styled from 'styled-components/macro';
import { Trans, useTranslation } from 'react-i18next';
import { CorpUser, EntityType } from '../../../types.generated';
import getAvatarColor from '../../shared/avatar/getAvatarColor';
import { toLocalDateTimeString } from '../../shared/time/timeUtils';
import { useEntityRegistry } from '../../useEntityRegistry';

const StyledAvatar = styled(Avatar)<{ backgroundColor: string }>`
    color: #fff;
    background-color: ${(props) => props.backgroundColor};
    margin-right: 20px;
    height: 22px;
    width: 22px;
    .ant-avatar-string {
        text-align: center;
        line-height: 22px;
    }
`;

const LineageIcon = styled(PartitionOutlined)`
    font-size: 16px;
    margin-right: 4px;
`;

const PopoverWrapper = styled.div`
    display: flex;
    align-items: center;
`;

interface Props {
    createdActor?: CorpUser | null;
    createdOn?: number | null;
}

export default function UserAvatar({ createdActor, createdOn }: Props) {
    const entityRegistry = useEntityRegistry();
    const avatarPhotoUrl = createdActor?.editableProperties?.pictureLink;
    const userName = entityRegistry.getDisplayName(EntityType.CorpUser, createdActor);
    const { i18n } = useTranslation();

    return (
        <Popover
            content={
                <PopoverWrapper>
                    <LineageIcon />
                    {!createdOn && (
                        <Trans
                            {...{
                                i18nKey: 'reporting.relationshipAddedByUser_component',
                                values: {
                                    userName,
                                },
                                components: {
                                    bold: <strong />,
                                },
                            }}
                        />
                    )}
                    {createdOn && (
                        <Trans
                            {...{
                                i18nKey: 'reporting.relationshipAddedByUserOnDate_component',
                                values: {
                                    userName,
                                    date: toLocalDateTimeString(createdOn, i18n.language),
                                },
                                components: {
                                    bold: <strong />,
                                },
                            }}
                        />
                    )}
                </PopoverWrapper>
            }
        >
            <StyledAvatar src={avatarPhotoUrl} backgroundColor={getAvatarColor(userName)}>
                {userName.charAt(0).toUpperCase()}
            </StyledAvatar>
        </Popover>
    );
}
