import React from 'react';
import { BookOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

type Props = {
    name: string;
};

const TermName = styled.span`
    margin-left: 5px;
`;

export default function TermLabel({ name }: Props) {
    const { t } = useTranslation();
    return (
        <div>
            <BookOutlined />
            <TermName>{name}</TermName>
            {t('common.min')}
        </div>
    );
}
