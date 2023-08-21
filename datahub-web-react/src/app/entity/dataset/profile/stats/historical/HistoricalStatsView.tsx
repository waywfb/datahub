import React, { ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Affix, Row, Select, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useGetDataProfilesLazyQuery } from '../../../../../../graphql/dataset.generated';
import { DatasetProfile, DateInterval } from '../../../../../../types.generated';
import { Message } from '../../../../../shared/Message';
import { getFixedLookbackWindow, TimeWindowSize } from '../../../../../shared/time/timeUtils';

import ProfilingRunsChart from './charts/ProfilingRunsChart';
import StatsSection from '../StatsSection';
import StatChart from './charts/StatChart';

const HeaderRow = styled(Row)`
    padding-top: 24px;
    padding-bottom: 28px;
    background-color: white;
`;

const SubHeaderText = styled(Typography.Text)`
    color: gray;
    font-size: 16px;
`;

const EmbeddedSelect = styled(Select)`
    padding-left: 8px;
`;

const isPresent = (val: any) => {
    return val !== undefined && val !== null;
};

/**
 * Extracts a set of points used to render charts from a list of Dataset Profiles +
 * a particular numeric statistic name to extract. Note that the stat *must* be numeric for this utility to work.
 */
const extractChartValuesFromTableProfiles = (profiles: Array<any>, statName: string) => {
    return profiles
        .filter((profile) => isPresent(profile[statName]))
        .map((profile) => ({
            timeMs: profile.timestampMillis,
            value: profile[statName] as number,
        }));
};

/**
 * Extracts a set of field-specific points used to render charts from a list of Dataset Profiles +
 * a particular numeric statistic name to extract. Note that the stat *must* be numeric for this utility to work.
 */
const extractChartValuesFromFieldProfiles = (profiles: Array<any>, fieldPath: string, statName: string) => {
    return profiles
        .filter((profile) => profile.fieldProfiles)
        .map((profile) => {
            const fieldProfiles = profile.fieldProfiles
                ?.filter((field) => field.fieldPath === fieldPath)
                .filter((field) => field[statName] !== null && field[statName] !== undefined);

            if (fieldProfiles?.length === 1) {
                const fieldProfile = fieldProfiles[0];
                return {
                    timeMs: profile.timestampMillis,
                    value: fieldProfile[statName],
                };
            }
            return null;
        })
        .filter((value) => value !== null);
};

const computeChartTickInterval = (windowSize: TimeWindowSize): DateInterval => {
    switch (windowSize.interval) {
        case DateInterval.Day:
            return DateInterval.Hour;
        case DateInterval.Week:
            return DateInterval.Day;
        case DateInterval.Month:
            return DateInterval.Week;
        case DateInterval.Year:
            return DateInterval.Month;
        default:
            throw new Error(`Unrecognized DateInterval provided ${windowSize.interval}`);
    }
};

const computeAllFieldPaths = (profiles: Array<DatasetProfile>): Set<string> => {
    const uniqueFieldPaths = new Set<string>();
    profiles.forEach((profile) => {
        const fieldProfiles = profile.fieldProfiles || [];
        fieldProfiles.forEach((fieldProfile) => {
            uniqueFieldPaths.add(fieldProfile.fieldPath);
        });
    });
    return uniqueFieldPaths;
};

/**
 * Change this to add or modify the lookback windows that are selectable via the UI.
 */
const LOOKBACK_WINDOWS = [
    { translateKey: 'duration.day_interval', value: '1 day', windowSize: { interval: DateInterval.Day, count: 1 } },
    { translateKey: 'duration.week_interval', value: '1 week', windowSize: { interval: DateInterval.Week, count: 1 } },
    {
        translateKey: 'duration.month_interval',
        value: '1 month',
        windowSize: { interval: DateInterval.Month, count: 1 },
    },
    {
        translateKey: 'duration.month_interval',
        value: '3 months',
        windowSize: { interval: DateInterval.Month, count: 3 },
    },
    { translateKey: 'duration.year_interval', value: '1 year', windowSize: { interval: DateInterval.Year, count: 1 } },
];

const DEFAULT_LOOKBACK_WINDOW = '3 months';

const getLookbackWindowSize = (value: string) => {
    for (let i = 0; i < LOOKBACK_WINDOWS.length; i++) {
        const window = LOOKBACK_WINDOWS[i];
        if (window.value === value) {
            return window.windowSize;
        }
    }
    throw new Error(`Unrecognized lookback window size ${value} provided`);
};

export type Props = {
    urn: string;
    toggleView: ReactNode;
};

export default function HistoricalStatsView({ urn, toggleView }: Props) {
    const { t } = useTranslation();
    const [getDataProfiles, { data: profilesData, loading: profilesLoading }] = useGetDataProfilesLazyQuery({
        fetchPolicy: 'cache-first',
    });

    /**
     * Perform initial fetch of default lookback window stats.
     */
    useEffect(() => {
        getDataProfiles({
            variables: { urn, ...getFixedLookbackWindow(getLookbackWindowSize(DEFAULT_LOOKBACK_WINDOW)) },
        });
    }, [urn, getDataProfiles]);

    /**
     * Determines which fixed lookback window is used to display historical statistics. See above for valid options.
     */
    const [selectedLookbackWindow, setSelectedLookbackWindow] = useState(DEFAULT_LOOKBACK_WINDOW);
    const selectedWindowSize = getLookbackWindowSize(selectedLookbackWindow);
    const selectedWindow = getFixedLookbackWindow(selectedWindowSize);

    /**
     * Determines which field path is highlighted in column stats. Defaults to none.
     */
    const [selectedFieldPath, setSelectedFieldPath] = useState('');

    /**
     *  Change handlers.
     */
    const onChangeSelectedLookbackWindow = (text) => {
        const newWindowSize = getLookbackWindowSize(text);
        const newTimeWindow = getFixedLookbackWindow(newWindowSize);
        getDataProfiles({
            variables: { urn, ...newTimeWindow },
        });
        setSelectedLookbackWindow(text);
    };

    const onChangeSelectedFieldPath = (value) => {
        setSelectedFieldPath(value);
    };

    const graphTickInterval = computeChartTickInterval(selectedWindowSize);
    const graphDateRange = {
        start: selectedWindow.startTime.toString(),
        end: selectedWindow.endTime.toString(),
    };

    const profiles = profilesData?.dataset?.datasetProfiles || [];
    const allFieldPaths = Array.from(computeAllFieldPaths(profiles));

    if (selectedFieldPath === '' && allFieldPaths.length > 0) {
        // Set initially selected field path.
        setSelectedFieldPath(allFieldPaths[0]);
    }

    const columnSelectView = (
        <span>
            <SubHeaderText>{t('reporting.viewingStatsForColumn')}</SubHeaderText>
            <EmbeddedSelect style={{ width: 200 }} value={selectedFieldPath} onChange={onChangeSelectedFieldPath}>
                {allFieldPaths.map((fieldPath) => (
                    <Select.Option value={fieldPath}>{fieldPath}</Select.Option>
                ))}
            </EmbeddedSelect>
        </span>
    );

    /**
     * Compute Table Stat chart data.
     */
    const rowCountChartValues = extractChartValuesFromTableProfiles(profiles, 'rowCount');
    const columnCountChartValues = extractChartValuesFromTableProfiles(profiles, 'columnCount');

    /**
     * Compute Column Stat chart data.
     */
    const nullCountChartValues: Array<any> = extractChartValuesFromFieldProfiles(
        profiles,
        selectedFieldPath,
        'nullCount',
    );
    const nullPercentageChartValues: Array<any> = extractChartValuesFromFieldProfiles(
        profiles,
        selectedFieldPath,
        'nullProportion',
    );
    const distinctCountChartValues: Array<any> = extractChartValuesFromFieldProfiles(
        profiles,
        selectedFieldPath,
        'uniqueCount',
    );
    const distinctPercentageChartValues: Array<any> = extractChartValuesFromFieldProfiles(
        profiles,
        selectedFieldPath,
        'uniqueProportion',
    );

    return (
        <>
            {profilesLoading && (
                <Message type="loading" content={`${t('common.loading')}...`} style={{ marginTop: '10%' }} />
            )}
            <Affix offsetTop={127}>
                <HeaderRow justify="space-between" align="middle">
                    <div>
                        <Typography.Title level={2}>{t('reporting.profilingHistory')}</Typography.Title>
                        <span>
                            <SubHeaderText>{t('reporting.viewingProfilingHistoryForThePast')}</SubHeaderText>
                            <EmbeddedSelect value={selectedLookbackWindow} onChange={onChangeSelectedLookbackWindow}>
                                {LOOKBACK_WINDOWS.map((lookbackWindow) => (
                                    <Select.Option value={lookbackWindow.value}>
                                        {t(lookbackWindow.translateKey, {
                                            postProcess: 'interval',
                                            count: lookbackWindow.windowSize.count,
                                        })}
                                    </Select.Option>
                                ))}
                            </EmbeddedSelect>
                        </span>
                    </div>
                    {toggleView}
                </HeaderRow>
            </Affix>
            <StatsSection title={t('reporting.profilingRuns')}>
                <Row>
                    <ProfilingRunsChart profiles={profiles} />
                </Row>
            </StatsSection>
            <StatsSection title={t('reporting.historicalTableStats')}>
                <Row>
                    <StatChart
                        title={t('reporting.rowCountOverTime')}
                        tickInterval={graphTickInterval}
                        dateRange={graphDateRange}
                        values={rowCountChartValues}
                    />
                    <StatChart
                        title={t('reporting.columnCountOverTime')}
                        tickInterval={graphTickInterval}
                        dateRange={graphDateRange}
                        values={columnCountChartValues}
                    />
                </Row>
            </StatsSection>
            <StatsSection title={t('reporting.historicalColumnStats')} rightFloatView={columnSelectView}>
                <Row>
                    <StatChart
                        title={t('reporting.nullCountOverTime')}
                        tickInterval={graphTickInterval}
                        dateRange={graphDateRange}
                        values={nullCountChartValues}
                    />
                    <StatChart
                        title={t('reporting.nullPercentageOverTime')}
                        tickInterval={graphTickInterval}
                        dateRange={graphDateRange}
                        values={nullPercentageChartValues}
                    />
                    <StatChart
                        title={t('reporting.distinctCountOverTime')}
                        tickInterval={graphTickInterval}
                        dateRange={graphDateRange}
                        values={distinctCountChartValues}
                    />
                    <StatChart
                        title={t('reporting.distinctPercentageOverTime')}
                        tickInterval={graphTickInterval}
                        dateRange={graphDateRange}
                        values={distinctPercentageChartValues}
                    />
                </Row>
            </StatsSection>
        </>
    );
}
