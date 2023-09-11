import React from 'react';
import { Typography } from 'antd';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const SummaryContainer = styled.div`
    margin-bottom: 16px;
    padding-left: 10px;
    & ul {
        padding-inline-start: 30px;
        margin-top: 5px;
    }
`;

export interface SchemaDiffSummary {
    added: number;
    removed: number;
    updated: number;
}

type Props = {
    diffSummary: SchemaDiffSummary;
};

export default function SchemaVersionSummary({ diffSummary }: Props) {
    const { t } = useTranslation();
    return (
        <SummaryContainer>
            <ul>
                {diffSummary.added ? (
                    <li>
                        <Typography.Text>
                            {t('dataset.addedColumnWithCount_interval', {
                                postProcess: 'interval',
                                count: diffSummary.added,
                            })}
                        </Typography.Text>
                    </li>
                ) : null}
                {diffSummary.removed ? (
                    <li>
                        <Typography.Text>
                            {t('dataset.removedColumnWithCount_interval', {
                                postProcess: 'interval',
                                count: diffSummary.removed,
                            })}
                        </Typography.Text>
                    </li>
                ) : null}
                {diffSummary.updated ? (
                    <li>
                        <Typography.Text>
                            {t('dataset.updatedDescriptionWithCount_interval', {
                                postProcess: 'interval',
                                count: diffSummary.updated,
                            })}
                        </Typography.Text>
                    </li>
                ) : null}
            </ul>
        </SummaryContainer>
    );
}
