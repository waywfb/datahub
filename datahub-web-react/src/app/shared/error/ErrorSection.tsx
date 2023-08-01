import { Image, Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { Trans, useTranslation } from 'react-i18next';
import dataHubLogo from '../../../images/datahublogo.png';
import { ANTD_GRAY } from '../../entity/shared/constants';

const Section = styled.div`
    width: auto;
    margin-top: 40px;
    margin-left: 60px;
`;

const TitleText = styled(Typography.Text)`
    font-size: 18px;
    margin-left: 8px;
    color: ${ANTD_GRAY[7]};
`;

const TitleSection = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
`;

const MessageSection = styled.div`
    margin-bottom: 20px;
`;

const DetailParagraph = styled(Typography.Paragraph)`
    font-size: 14px;
`;

const ResourceList = styled.ul`
    font-size: 14px;
`;

const ResourceListItem = styled.li`
    margin-bottom: 4px;
`;

const resources = [
    {
        key: 'error.errorSection.ressourcesLabel.project',
        path: 'https://datahubproject.io',
        shouldOpenInNewTab: true,
    },
    {
        key: 'error.errorSection.ressourcesLabel.docs',
        path: 'https://datahubproject.io/docs',
        shouldOpenInNewTab: true,
    },
    {
        key: 'error.errorSection.ressourcesLabel.github',
        path: 'https://github.com/datahub-project/datahub',
        shouldOpenInNewTab: true,
    },
];

export const ErrorSection = (): JSX.Element => {
    const { t } = useTranslation(['translation', 'theme']);

    return (
        <Section>
            <div>
                <TitleSection>
                    <Image src={dataHubLogo} preview={false} style={{ width: 40 }} />
                    <TitleText strong>{t('title', { ns: 'theme' })}</TitleText>
                </TitleSection>
                <MessageSection>
                    <Typography.Title level={2}>{t('error.errorSection.somethingWentWrong')}</Typography.Title>
                    <DetailParagraph type="secondary">
                        {t('error.errorSection.anUnexpectedErrorOccurred')}
                    </DetailParagraph>
                </MessageSection>
                <div>
                    <DetailParagraph type="secondary">
                        <Trans
                            {...{
                                i18nKey: 'error.errorSection.needSupport_html',
                                components: { bold: <b /> },
                            }}
                        />
                    </DetailParagraph>
                    <ResourceList>
                        {resources.map((resource) => (
                            <ResourceListItem key={resource.path}>
                                <a href={resource.path}>{t(resource.key)}</a>
                            </ResourceListItem>
                        ))}
                    </ResourceList>
                </div>
            </div>
        </Section>
    );
};
