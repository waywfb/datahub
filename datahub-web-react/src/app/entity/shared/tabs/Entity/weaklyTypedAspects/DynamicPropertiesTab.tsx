import React from 'react';
import { Typography } from 'antd';
import styled from 'styled-components';

import { useTranslation } from 'react-i18next';
import { StyledTable } from '../../../components/styled/StyledTable';
import { ANTD_GRAY } from '../../../constants';
import TableValueElement from './TableValueElement';

type Props = {
    payload: string | undefined | null;
};

const NameText = styled(Typography.Text)`
    font-weight: 600;
    font-size: 12px;
    color: ${ANTD_GRAY[9]};
`;

export default function DynamicTabularTab({ payload: rawPayload }: Props) {
    const { t } = useTranslation();
    const aspectData = JSON.parse(rawPayload || '{}');
    const transformedRowData = Object.keys(aspectData).map((key) => ({ key, value: aspectData[key] }));

    const propertyTableColumns = [
        {
            width: 210,
            title: t('common.name'),
            dataIndex: 'key',
            sorter: (a, b) => a?.key.localeCompare(b?.key || '') || 0,
            defaultSortOrder: 'ascend',
            render: (name: string) => <NameText>{name}</NameText>,
        },
        {
            title: t('common.value'),
            dataIndex: 'value',
            render: (value: string) => <TableValueElement value={value} />,
        },
    ];

    return (
        <StyledTable
            pagination={false}
            // typescript is complaining that default sort order is not a valid column field- overriding this here
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            columns={propertyTableColumns}
            dataSource={transformedRowData}
        />
    );
}
