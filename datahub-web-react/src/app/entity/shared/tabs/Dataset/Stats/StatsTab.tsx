import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GetDatasetQuery, useGetLastMonthUsageAggregationsQuery } from '../../../../../../graphql/dataset.generated';
import { DatasetProfile, Operation, UsageQueryResult } from '../../../../../../types.generated';
import { useBaseEntity } from '../../../EntityContext';
import { toLocalDateString, toLocalTimeString, toLocalDateTimeString } from '../../../../../shared/time/timeUtils';
import HistoricalStats from './historical/HistoricalStats';
import { LOOKBACK_WINDOWS } from './lookbackWindows';
import ColumnStats from './snapshot/ColumnStats';
import TableStats from './snapshot/TableStats';
import StatsHeader from './StatsHeader';
import { ViewType } from './viewType';

export default function StatsTab() {
    const { t, i18n } = useTranslation();
    const baseEntity = useBaseEntity<GetDatasetQuery>();

    const [viewType, setViewType] = useState(ViewType.LATEST);
    const [lookbackWindow, setLookbackWindow] = useState(LOOKBACK_WINDOWS.QUARTER);

    const { data: usageStatsData } = useGetLastMonthUsageAggregationsQuery({
        variables: { urn: baseEntity?.dataset?.urn as string },
        skip: !baseEntity?.dataset?.urn,
    });

    const hasUsageStats = usageStatsData?.dataset?.usageStats !== undefined;
    const hasDatasetProfiles = baseEntity?.dataset?.datasetProfiles !== undefined;
    const hasOperations = baseEntity?.dataset?.operations !== undefined;

    const usageStats = (hasUsageStats && (usageStatsData?.dataset?.usageStats as UsageQueryResult)) || undefined;
    const datasetProfiles =
        (hasDatasetProfiles && (baseEntity?.dataset?.datasetProfiles as Array<DatasetProfile>)) || undefined;

    // Used for rendering latest stats.
    const latestProfile = datasetProfiles && datasetProfiles[0]; // This is required for showing latest stats.
    const urn = baseEntity && baseEntity.dataset && baseEntity.dataset?.urn;

    // Used for rendering operation info.
    const operations = (hasOperations && (baseEntity?.dataset?.operations as Array<Operation>)) || undefined;
    const latestOperation = operations && operations[0];
    const lastUpdatedTime =
        latestOperation && toLocalDateTimeString(latestOperation?.lastUpdatedTimestamp, i18n.language);
    const lastReportedTime = latestOperation && toLocalDateTimeString(latestOperation?.timestampMillis, i18n.language);
    // Okay so if we are disabled, we don't have both or the other. Let's render

    // const emptyView = <Empty description="TODO: Stats!" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    // Action buttons.
    // Table Stats.
    // Column Stats

    const reportedAt =
        latestProfile &&
        t('reporting.reportedOnAtWithDateTime', {
            date: toLocalDateString(latestProfile?.timestampMillis, i18n.language),
            time: toLocalTimeString(latestProfile?.timestampMillis, i18n.language),
        });

    const totalSqlQueries = usageStats?.aggregations?.totalSqlQueries;
    const queryCountLast30Days = baseEntity.dataset?.statsSummary?.queryCountLast30Days;

    const statsHeader = (
        <StatsHeader
            viewType={viewType}
            setViewType={setViewType}
            reportedAt={reportedAt || ''}
            lookbackWindow={lookbackWindow}
            setLookbackWindow={setLookbackWindow}
            t={t}
        />
    );

    const latestStats = (
        <>
            <TableStats
                rowCount={latestProfile?.rowCount || undefined}
                columnCount={latestProfile?.columnCount || undefined}
                queryCount={queryCountLast30Days || totalSqlQueries || undefined}
                users={usageStats?.aggregations?.users || undefined}
                lastUpdatedTime={lastUpdatedTime || undefined}
                lastReportedTime={lastReportedTime || undefined}
            />
            {latestProfile?.fieldProfiles && latestProfile?.fieldProfiles?.length > 0 && (
                <ColumnStats columnStats={(latestProfile && latestProfile.fieldProfiles) || []} />
            )}
        </>
    );

    const historicalStats = <HistoricalStats urn={urn || ''} lookbackWindow={lookbackWindow} />;

    return (
        <>
            {statsHeader}
            {viewType === ViewType.LATEST ? latestStats : historicalStats}
        </>
    );
}
