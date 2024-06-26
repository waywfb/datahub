import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Affix, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { DatasetProfile } from '../../../../../../types.generated';
import DataProfileView from './SnapshotStatsView';

const HeaderRow = styled(Row)`
    padding-top: 24px;
    padding-bottom: 28px;
    background-color: white;
`;

export type Props = {
    profile: DatasetProfile;
    toggleView: ReactNode;
};

export default function LatestStatsView({ profile, toggleView }: Props) {
    const { t } = useTranslation();
    const reportedAtDate = new Date(profile.timestampMillis);
    return (
        <>
            <Affix offsetTop={127}>
                <HeaderRow justify="space-between" align="middle">
                    <div>
                        <Typography.Title level={2}>{t('reporting.latestStats')}</Typography.Title>
                        <Typography.Text style={{ color: 'gray' }}>
                            {t('reporting.reportedOnAtWithDateTime', {
                                date: reportedAtDate.toLocaleDateString(),
                                time: reportedAtDate.toLocaleTimeString(),
                            })}
                        </Typography.Text>
                    </div>
                    {toggleView}
                </HeaderRow>
            </Affix>
            <DataProfileView profile={profile} />
        </>
    );
}
