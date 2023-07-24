import React from 'react';
import { Typography } from 'antd';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { ANTD_GRAY } from '../entity/shared/constants';
import { Post } from '../../types.generated';

const CardContainer = styled.div`
    display: flex;
    flex-direction: row;
    min-height: 140px;
    border: 1px solid ${ANTD_GRAY[4]};
    border-radius: 12px;
    box-shadow: ${(props) => props.theme.styles['box-shadow']};
    &&:hover {
        box-shadow: ${(props) => props.theme.styles['box-shadow-hover']};
    }
    white-space: unset;
`;

const TextContainer = styled.div`
    margin-left: 12px;
    display: flex;
    justify-content: center;
    align-items: start;
    flex-direction: column;
`;

const TitleText = styled(Typography.Title)`
    word-break: break-word;
    min-height: 20px;
`;

const HeaderText = styled(Typography.Text)`
    margin-top: 12px;
`;

const AnnouncementText = styled(Typography.Paragraph)`
    font-size: 12px;
    color: ${ANTD_GRAY[7]};
`;

type Props = {
    textPost: Post;
};

export const PostTextCard = ({ textPost }: Props) => {
    const { t } = useTranslation();
    return (
        <CardContainer>
            <TextContainer>
                <HeaderText type="secondary">{t('common.announcement')}</HeaderText>
                <TitleText
                    ellipsis={{
                        rows: 1,
                    }}
                    level={5}
                >
                    {textPost?.content?.title}
                </TitleText>
                <AnnouncementText>{textPost?.content?.description}</AnnouncementText>
            </TextContainer>
        </CardContainer>
    );
};
