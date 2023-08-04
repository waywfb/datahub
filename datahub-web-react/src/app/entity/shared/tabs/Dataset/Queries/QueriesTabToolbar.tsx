import { Button, Input, Tooltip } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import TabToolbar from '../../../components/styled/TabToolbar';

const StyledInput = styled(Input)`
    border-radius: 70px;
    max-width: 300px;
`;

type Props = {
    addQueryDisabled: boolean;
    onAddQuery: () => void;
    onChangeSearch: (text: any) => void;
};

export default function QueriesTabToolbar({ addQueryDisabled, onAddQuery, onChangeSearch }: Props) {
    const { t } = useTranslation();
    return (
        <TabToolbar>
            <Tooltip
                placement="right"
                title={
                    (addQueryDisabled && t('entity.entity.notAuthorizedToAddQueriesToEntity')) ||
                    t('entity.entity.addAHighlightedQuery')
                }
            >
                <Button disabled={addQueryDisabled} type="text" onClick={onAddQuery} data-testid="add-query-button">
                    <PlusOutlined /> {t('crud.addWithName', { name: t('common.query') })}
                </Button>
            </Tooltip>
            <StyledInput
                placeholder={t('placeholder.searchInWithName', { name: t('common.queries').toLowerCase() })}
                onChange={onChangeSearch}
                allowClear
                prefix={<SearchOutlined />}
                data-testid="search-query-input"
            />
        </TabToolbar>
    );
}
