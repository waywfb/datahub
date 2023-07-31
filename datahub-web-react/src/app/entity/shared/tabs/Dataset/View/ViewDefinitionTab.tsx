import { Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { useTranslation } from 'react-i18next';
import { GetDatasetQuery } from '../../../../../../graphql/dataset.generated';
import { ANTD_GRAY } from '../../../constants';
import { useBaseEntity } from '../../../EntityContext';
import { InfoItem } from '../../../components/styled/InfoItem';

const InfoSection = styled.div`
    border-bottom: 1px solid ${ANTD_GRAY[4.5]};
    padding: 16px 20px;
`;

const InfoItemContainer = styled.div<{ justifyContent }>`
    display: flex;
    position: relative;
    justify-content: ${(props) => props.justifyContent};
    padding: 12px 2px;
`;

const InfoItemContent = styled.div`
    padding-top: 8px;
`;

const QueryText = styled(Typography.Paragraph)`
    margin-top: 20px;
    background-color: ${ANTD_GRAY[2]};
`;

// NOTE: Yes, using `!important` is a shame. However, the SyntaxHighlighter is applying styles directly
// to the component, so there's no way around this
const NestedSyntax = styled(SyntaxHighlighter)`
    background-color: transparent !important;
    border: none !important;
`;

export default function ViewDefinitionTab() {
    const { t } = useTranslation();
    const baseEntity = useBaseEntity<GetDatasetQuery>();
    const logic = baseEntity?.dataset?.viewProperties?.logic || t('common.unknown').toUpperCase();
    const materialized = (baseEntity?.dataset?.viewProperties?.materialized && true) || false;
    const language = baseEntity?.dataset?.viewProperties?.language || t('common.unknown').toUpperCase();

    return (
        <>
            <InfoSection>
                <Typography.Title level={5}>{t('common.details')}</Typography.Title>
                <InfoItemContainer justifyContent="left">
                    <InfoItem title={t('common.materialized')}>
                        <InfoItemContent>{materialized ? t('common.true') : t('common.false')}</InfoItemContent>
                    </InfoItem>
                    <InfoItem title={t('common.language')}>
                        <InfoItemContent>{language.toUpperCase()}</InfoItemContent>
                    </InfoItem>
                </InfoItemContainer>
            </InfoSection>
            <InfoSection>
                <Typography.Title level={5}>{t('common.logic')}</Typography.Title>
                <QueryText>
                    <NestedSyntax language="sql">{logic}</NestedSyntax>
                </QueryText>
            </InfoSection>
        </>
    );
}
