import { Row, Table, Tag, Typography } from 'antd';
import styled from 'styled-components';

import { ColumnsType, ColumnType } from 'antd/lib/table';
import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { DatasetProfile } from '../../../../../../types.generated';
import { Highlight } from '../../../../../analyticsDashboard/components/Highlight';
import StatsSection from '../StatsSection';

const ColumnStatsTable = styled(Table)`
    margin-top: 24px;
`;

const isPresent = (val: any) => {
    return val !== undefined && val !== null;
};

const decimalToPercentStr = (decimal: number, precision: number): string => {
    return `${(decimal * 100).toFixed(precision)}%`;
};

export type Props = {
    profile: DatasetProfile;
};

export default function DataProfileView({ profile }: Props) {
    const { t } = useTranslation();
    const columnStatsTableData = useMemo(
        () =>
            profile.fieldProfiles?.map((doc) => ({
                name: doc.fieldPath,
                min: doc.min,
                max: doc.max,
                mean: doc.mean,
                median: doc.median,
                stdev: doc.stdev,
                nullCount: isPresent(doc.nullCount) && doc.nullCount!.toString(),
                nullPercentage: isPresent(doc.nullProportion) && decimalToPercentStr(doc.nullProportion!, 2),
                distinctCount: isPresent(doc.uniqueCount) && doc.uniqueCount!.toString(),
                distinctPercentage: isPresent(doc.uniqueProportion) && decimalToPercentStr(doc.uniqueProportion!, 2),
                sampleValues: doc.sampleValues,
            })) || [],
        [profile],
    );

    /**
     * Returns a placeholder value to show in the column data table when data is null.
     */
    const unknownValue = () => {
        return <Typography.Text style={{ color: '#B8B8B8' }}>{t('common.unknown').toLowerCase()}</Typography.Text>;
    };

    /**
     * Computes a set of the object keys across all items in a given array.
     */
    const getItemKeySet = (items: Array<any>) => {
        const keySet = new Set<string>();
        items.forEach((item) => {
            Object.keys(item).forEach((key) => {
                keySet.add(key);
            });
        });
        return keySet;
    };

    /**
     * Dynamically builds column stat table columns based on the fields present in the dataset profile data.
     */
    const buildColumnStatsColumns = (tableData: Array<any>) => {
        // Optional columns. Defines how to render a column given a value exists somewhere in the profile.
        const optionalColumns: ColumnsType<any> = [
            {
                title: <Trans i18nKey="common.min" />,
                dataIndex: 'min',
                render: (value) => value || unknownValue(),
            },
            {
                title: <Trans i18nKey="common.max" />,
                dataIndex: 'max',
                render: (value) => value || unknownValue(),
            },
            {
                title: <Trans i18nKey="reporting.mean" />,
                dataIndex: 'mean',
                render: (value) => value || unknownValue(),
            },
            {
                title: <Trans i18nKey="reporting.median" />,
                dataIndex: 'median',
                render: (value) => value || unknownValue(),
            },
            {
                title: <Trans i18nKey="reporting.nullCount" />,
                dataIndex: 'nullCount',
                render: (value) => value || unknownValue(),
            },
            {
                title: <Trans i18nKey="reporting.nullPercent" />,
                dataIndex: 'nullPercentage',
                render: (value) => value || unknownValue(),
            },
            {
                title: <Trans i18nKey="reporting.distinctCount" />,
                dataIndex: 'distinctCount',
                render: (value) => value || unknownValue(),
            },
            {
                title: <Trans i18nKey="reporting.distinctPercent" />,
                dataIndex: 'distinctPercentage',
                render: (value) => value || unknownValue(),
            },
            {
                title: <Trans i18nKey="reporting.stdDev" />,
                dataIndex: 'stdev',
                render: (value) => value || unknownValue(),
            },
            {
                title: <Trans i18nKey="common.sampleValues" />,
                dataIndex: 'sampleValues',
                render: (sampleValues: Array<string>) => {
                    return (
                        (sampleValues &&
                            sampleValues
                                .slice(0, sampleValues.length < 3 ? sampleValues?.length : 3)
                                .map((value) => <Tag key={value}>{value}</Tag>)) ||
                        unknownValue()
                    );
                },
            },
        ];

        // Name column always required.
        const requiredColumns: ColumnsType<any> = [
            {
                title: <Trans i18nKey="reporting.name" />,
                dataIndex: 'name',
            },
        ];

        // Retrieves a set of names of columns that should be shown based on their presence in the data profile.
        const columnsPresent: Set<string> = getItemKeySet(tableData);

        // Compute the final columns to render.
        const columns = [
            ...requiredColumns,
            ...optionalColumns.filter((column: ColumnType<any>) => columnsPresent.has(column.dataIndex as string)),
        ];

        // TODO: Support Quantiles && Distinct Value Frequencies.
        return columns;
    };

    const columnStatsColumns = buildColumnStatsColumns(columnStatsTableData);

    const rowCount = (isPresent(profile?.rowCount) ? profile?.rowCount : -1) as number;
    const rowCountTitle = (rowCount >= 0 && t('common.rows')) || t('reporting.rowCountUnknown');

    const columnCount = (isPresent(profile?.columnCount) ? profile?.columnCount : -1) as number;
    const columnCountTitle = (columnCount >= 0 && t('common.columns')) || t('reporting.columnCountUnknown');

    return (
        <>
            <StatsSection title={t('reporting.tableStats')}>
                <Row align="top" justify="start">
                    <Highlight highlight={{ value: rowCount, title: rowCountTitle, body: '' }} />
                    <Highlight highlight={{ value: columnCount, title: columnCountTitle, body: '' }} />
                </Row>
            </StatsSection>
            <StatsSection title={t('reporting.columnStats')}>
                <ColumnStatsTable
                    bordered
                    pagination={false}
                    columns={columnStatsColumns}
                    dataSource={columnStatsTableData}
                    // TODO: this table's types should be cleaned up so `any` is not needed here or in the column definitions
                    rowKey={(record: any) => record.name}
                />
            </StatsSection>
        </>
    );
}
