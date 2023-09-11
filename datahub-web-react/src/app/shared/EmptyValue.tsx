import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    label?: string;
}

const EmptyValueCSS: React.CSSProperties = {
    color: '#b7b7b7',
    fontStyle: 'italic',
    fontWeight: 100,
};

export const EmptyValue = ({ label }: Props) => {
    const { t } = useTranslation();
    return <div style={EmptyValueCSS}>{label || t('common.none')} </div>;
};
