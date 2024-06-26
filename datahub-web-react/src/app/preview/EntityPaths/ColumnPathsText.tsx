import { Tooltip } from 'antd';
import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { EntityPath, EntityType, LineageDirection, SchemaFieldEntity } from '../../../types.generated';
import { ANTD_GRAY } from '../../entity/shared/constants';
import { LineageTabContext } from '../../entity/shared/tabs/Lineage/LineageTabContext';
import ColumnsRelationshipText from './ColumnsRelationshipText';
import DisplayedColumns from './DisplayedColumns';

export const ResultText = styled.span`
    &:hover {
        border-bottom: 1px solid black;
        cursor: pointer;
    }
`;

const DescriptionWrapper = styled.span`
    color: ${ANTD_GRAY[8]};
`;

export function getDisplayedColumns(paths: EntityPath[], resultEntityUrn: string) {
    return paths
        .map((path) =>
            path.path?.filter(
                (entity) =>
                    entity?.type === EntityType.SchemaField &&
                    (entity as SchemaFieldEntity).parent.urn === resultEntityUrn,
            ),
        )
        .flat();
}

interface Props {
    paths: EntityPath[];
    resultEntityUrn: string;
    openModal: () => void;
}

export default function ColumnPathsText({ paths, resultEntityUrn, openModal }: Props) {
    const { lineageDirection } = useContext(LineageTabContext);
    const { t } = useTranslation();

    const displayedColumns = getDisplayedColumns(paths, resultEntityUrn);

    return (
        <>
            <DescriptionWrapper>
                {lineageDirection === LineageDirection.Downstream ? t('common.downstream') : t('common.upstream')}{' '}
                {t('common.column').toLowerCase()}
                {displayedColumns.length > 1 && 's'}
            </DescriptionWrapper>
            : &nbsp;
            <ResultText onClick={openModal}>
                <Tooltip
                    title={
                        <span>
                            {t('lineage.clickToSeeColumnPathFrom_interval', {
                                postProcess: 'interval',
                                count: paths.length || 0,
                            })}
                            <ColumnsRelationshipText displayedColumns={displayedColumns} />
                        </span>
                    }
                >
                    <span>
                        <DisplayedColumns displayedColumns={displayedColumns} />
                    </span>
                </Tooltip>
            </ResultText>
        </>
    );
}
