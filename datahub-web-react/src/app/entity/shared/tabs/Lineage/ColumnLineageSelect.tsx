import * as React from 'react';
import { Button, Select, Tooltip } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import styled from 'styled-components/macro';
import { blue } from '@ant-design/colors';
import { useHistory, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ImpactAnalysisIcon } from '../Dataset/Schema/components/MenuColumn';
import updateQueryParams from '../../../../shared/updateQueryParams';
import { downgradeV2FieldPath } from '../../../dataset/profile/schema/utils/utils';
import { useEntityData } from '../../EntityContext';
import { useGetEntityWithSchema } from '../Dataset/Schema/useGetEntitySchema';

const StyledSelect = styled(Select)`
    margin-right: 5px;
    min-width: 140px;
    max-width: 200px;
`;

const StyledButton = styled(Button)<{ isSelected: boolean }>`
    transition: color 0s;
    display: flex;
    align-items: center;

    ${(props) =>
        props.isSelected &&
        `
        color: ${blue[5]};
        &:focus, &:hover {
            color: ${blue[5]};
        }
    `};
`;

const TextWrapper = styled.span`
    margin-left: 8px;
`;

interface Props {
    selectedColumn?: string;
    isColumnLevelLineage: boolean;
    setSelectedColumn: (column: any) => void;
    setIsColumnLevelLineage: (isShowing: boolean) => void;
}

export default function ColumnsLineageSelect({
    selectedColumn,
    isColumnLevelLineage,
    setSelectedColumn,
    setIsColumnLevelLineage,
}: Props) {
    const { t } = useTranslation();
    const { entityData } = useEntityData();
    const location = useLocation();
    const history = useHistory();
    const { entityWithSchema } = useGetEntityWithSchema();

    function selectColumn(column: any) {
        updateQueryParams({ column }, location, history);
        setSelectedColumn(column);
    }

    const columnButtonTooltip = isColumnLevelLineage
        ? t('lineage.hideColumnLevelLineage')
        : t('lineage.showColumnLevelLineage');

    return (
        <>
            {isColumnLevelLineage && (
                <StyledSelect
                    value={selectedColumn}
                    onChange={selectColumn}
                    showSearch
                    allowClear
                    placeholder={t('placeholder.selectAColumn')}
                >
                    {entityWithSchema?.schemaMetadata?.fields.map((field) => {
                        const fieldPath = downgradeV2FieldPath(field.fieldPath);
                        return (
                            <Select.Option value={field.fieldPath}>
                                <Tooltip title={fieldPath}>{fieldPath}</Tooltip>
                            </Select.Option>
                        );
                    })}
                    {entityData?.inputFields?.fields?.map((field, idx) => {
                        const fieldPath = downgradeV2FieldPath(field?.schemaField?.fieldPath);
                        const key = `${field?.schemaField?.fieldPath}-${idx}`;
                        return (
                            <Select.Option key={key} value={field?.schemaField?.fieldPath || ''}>
                                <Tooltip title={fieldPath}>{fieldPath}</Tooltip>
                            </Select.Option>
                        );
                    })}
                </StyledSelect>
            )}
            <Tooltip title={columnButtonTooltip}>
                <StyledButton
                    type="text"
                    onClick={() => setIsColumnLevelLineage(!isColumnLevelLineage)}
                    data-testid="column-lineage-toggle"
                    isSelected={isColumnLevelLineage}
                >
                    <ImpactAnalysisIcon />
                    <TextWrapper>
                        <b>{t('lineage.columnLineage')}</b>
                        <CaretDownOutlined style={{ fontSize: '10px', marginLeft: 4 }} />
                    </TextWrapper>
                </StyledButton>
            </Tooltip>
        </>
    );
}
