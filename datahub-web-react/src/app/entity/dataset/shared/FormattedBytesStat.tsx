import React from 'react';
import { Tooltip } from 'antd';
import { formatBytes, formatNumberWithoutAbbreviation } from '../../../shared/formatNumber';
import { useTranslation } from 'react-i18next';

export const FormattedBytesStat = ({ bytes }: { bytes: number }) => {
    const { t } = useTranslation();
    const formattedBytes = formatBytes(bytes);
    return (
        <Tooltip title={t('dataset.dataSetByteOfStorage', {count: formatNumberWithoutAbbreviation(bytes) })}>
            <b>{formattedBytes.number}</b> {formattedBytes.unit}
        </Tooltip>
    );
};
