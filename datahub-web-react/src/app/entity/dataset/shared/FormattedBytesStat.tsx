import React from 'react';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { formatBytes, formatNumberWithoutAbbreviation } from '../../../shared/formatNumber';

export const FormattedBytesStat = ({ bytes }: { bytes: number }) => {
    const { t } = useTranslation();
    const formattedBytes = formatBytes(bytes);
    return (
        <Tooltip title={t('dataset.dataSetByteOfStorage', { count: formatNumberWithoutAbbreviation(bytes) })}>
            <b>{formattedBytes.number}</b> {formattedBytes.unit}
        </Tooltip>
    );
};
