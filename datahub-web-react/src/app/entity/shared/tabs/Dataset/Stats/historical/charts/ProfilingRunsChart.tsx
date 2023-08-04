import { Button, Modal, Table, Typography } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { DatasetProfile } from '../../../../../../../../types.generated';
import ColumnStats from '../../snapshot/ColumnStats';
import TableStats from '../../snapshot/TableStats';
import { useTranslation } from 'react-i18next';

export const ChartTable = styled(Table)`
    margin-top: 16px;
`;

export type Props = {
    profiles: Array<DatasetProfile>;
};

export default function ProfilingRunsChart({ profiles }: Props) {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [selectedProfileIndex, setSelectedProfileIndex] = useState(-1);

    const showProfileModal = (index: number) => {
        setSelectedProfileIndex(index);
        setShowModal(true);
    };

    const onClose = () => {
        setShowModal(false);
        setSelectedProfileIndex(-1);
    };

    const tableData = profiles.map((profile) => {
        const profileDate = new Date(profile.timestampMillis);
        return {
            timestamp: `${profileDate.toLocaleDateString()} at ${profileDate.toLocaleTimeString()}`,
            rowCount: profile.rowCount?.toString() || t('common.unknown'),
            columnCount: profile.columnCount?.toString() || t('common.unknown'),
        };
    });

    const tableColumns = [
        {
            title: t('common.date'),
            key: 'Date',
            dataIndex: 'timestamp',
            render: (title, record, index) => {
                return (
                    <Button type="text" onClick={() => showProfileModal(index)}>
                        <Typography.Text underline>{title}</Typography.Text>
                    </Button>
                );
            },
        },
        {
            title: t('reporting.rowCount'),
            key: 'Row Count',
            dataIndex: 'rowCount',
        },
        {
            title: t('reporting.columnCount'),
            key: 'Column Count',
            dataIndex: 'columnCount',
        },
    ];

    const selectedProfile = (selectedProfileIndex >= 0 && profiles[selectedProfileIndex]) || undefined;
    const profileModalTitle =
        selectedProfile && t('reporting.showingProfileFromAtWithDateTime',{
              date: new Date(selectedProfile?.timestampMillis).toLocaleDateString(),
              time: new Date(selectedProfile?.timestampMillis).toLocaleTimeString()
          });

    return (
        <>
            {selectedProfile && (
                <Modal width="100%" footer={null} title={profileModalTitle} visible={showModal} onCancel={onClose}>
                    <TableStats
                        rowCount={selectedProfile.rowCount || -1}
                        columnCount={selectedProfile.columnCount || -1}
                    />
                    <ColumnStats columnStats={selectedProfile.fieldProfiles || []} />
                </Modal>
            )}
            <ChartTable
                scroll={{ y: 400 }}
                bordered
                style={{ width: '100%', maxHeight: 440 }}
                columns={tableColumns}
                dataSource={tableData}
                pagination={false}
                size="small"
            />
        </>
    );
}
