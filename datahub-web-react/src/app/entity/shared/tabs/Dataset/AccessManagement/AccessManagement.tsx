import React from 'react';
import styled from 'styled-components';
import { Button, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { useBaseEntity } from '../../../EntityContext';
import { GetDatasetQuery, useGetExternalRolesQuery } from '../../../../../../graphql/dataset.generated';
import { useGetMeQuery } from '../../../../../../graphql/me.generated';
import { handleAccessRoles } from './utils';
import AccessManagerDescription from './AccessManagerDescription';

const StyledTable = styled(Table)`
    overflow: inherit;
    height: inherit;

    &&& .ant-table-cell {
        background-color: #fff;
    }
    &&& .ant-table-thead .ant-table-cell {
        font-weight: 600;
        font-size: 12px;
        color: '#898989';
    }
    &&
        .ant-table-thead
        > tr
        > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
        border: 1px solid #f0f0f0;
    }
` as typeof Table;

const StyledSection = styled.section`
    background-color: #fff;
    color: black;
    width: 83px;
    text-align: center;
    border-radius: 3px;
    border: none;
    font-weight: bold;
`;

const AccessButton = styled(Button)`
    background-color: #1890ff;
    color: white;
    width: 80px;
    height: 30px;
    border-radius: 3.5px;
    border: none;
    font-weight: bold;
    &:hover {
        background-color: #18baff;
        color: white;
        width: 80px;
        height: 30px;
        border-radius: 3.5px;
        border: none;
        font-weight: bold;
    }
`;

export default function AccessManagement() {
    const { t } = useTranslation();
    const { data: loggedInUser } = useGetMeQuery({ fetchPolicy: 'cache-first' });
    const baseEntity = useBaseEntity<GetDatasetQuery>();
    const { data: externalRoles } = useGetExternalRolesQuery({
        variables: { urn: baseEntity?.dataset?.urn as string },
        skip: !baseEntity?.dataset?.urn,
    });

    const columns = [
        {
            title: t('common.roleName'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: t('common.description'),
            dataIndex: 'description',
            key: 'description',
            render: (roleDescription) => {
                return <AccessManagerDescription description={roleDescription} />;
            },
        },
        {
            title: t('common.accessType'),
            dataIndex: 'accessType',
            key: 'accessType',
        },
        {
            title: t('common.access'),
            dataIndex: 'hasAccess',
            key: 'hasAccess',
            render: (hasAccess, record) => {
                if (hasAccess) {
                    return <StyledSection>{t('common.provisioned')}</StyledSection>;
                }
                if (record?.url) {
                    return (
                        <AccessButton
                            onClick={(e) => {
                                e.preventDefault();
                                window.open(record.url);
                            }}
                        >
                            {t('common.request')}
                        </AccessButton>
                    );
                }
                return <StyledSection />;
            },
            hidden: true,
        },
    ];

    return (
        <StyledTable dataSource={handleAccessRoles(externalRoles, loggedInUser)} columns={columns} pagination={false} />
    );
}
