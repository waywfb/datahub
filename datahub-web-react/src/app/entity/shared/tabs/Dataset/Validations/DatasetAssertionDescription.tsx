import { Popover, Typography, Button } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Trans, useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import {
    AssertionStdAggregation,
    AssertionStdOperator,
    AssertionStdParameters,
    DatasetAssertionInfo,
    DatasetAssertionScope,
    SchemaFieldRef,
} from '../../../../../../types.generated';
import { decodeSchemaField } from '../../../../../lineage/utils/columnLineageUtils';
import { getFormattedParameterValue } from './assertionUtils';
import { DatasetAssertionLogicModal } from './DatasetAssertionLogicModal';

const ViewLogicButton = styled(Button)`
    padding: 0;
    margin: 0;
`;

type Props = {
    assertionInfo: DatasetAssertionInfo;
};

/**
 * Returns the React Component to render for the aggregation portion of the Assertion Description
 * for Assertions on Dataset Schemas.
 *
 * Schema assertions require an aggregation.
 */
const getSchemaAggregationText = (
    aggregation: AssertionStdAggregation | undefined | null,
    fields: Array<SchemaFieldRef> | undefined | null,
    t: TFunction,
) => {
    switch (aggregation) {
        case AssertionStdAggregation.ColumnCount:
            return <Typography.Text>{t('assertion.datasetColumnCount')}</Typography.Text>;
        case AssertionStdAggregation.Columns:
            return <Typography.Text>{t('assertion.datasetColumnsAre')}</Typography.Text>;
        case AssertionStdAggregation.Native: {
            const fieldNames = fields?.map((field) => decodeSchemaField(field.path)) || [];
            return (
                <Typography.Text>
                    <Trans
                        {...{
                            i18nKey: 'assertion.dataSetColumnsAre_component',
                            values: {
                                fieldNames: JSON.stringify(fieldNames),
                            },
                            components: { typographyTextStrong: <Typography.Text strong /> },
                        }}
                    />
                </Typography.Text>
            );
        }
        default:
            console.error(`Unsupported schema aggregation assertion ${aggregation} provided.`);
            return <Typography.Text>{t('assertion.datasetColumnsAre')}</Typography.Text>;
    }
};

/**
 * Returns the React Component to render for the aggregation portion of the Assertion Description
 * for Assertions on Dataset Rows
 *
 * Row assertions require an aggregation.
 */
const getRowsAggregationText = (aggregation: AssertionStdAggregation | undefined | null, t: TFunction) => {
    switch (aggregation) {
        case AssertionStdAggregation.RowCount:
            return <Typography.Text>{t('assertion.datasetRowCountIs')}</Typography.Text>;
        case AssertionStdAggregation.Native:
            return <Typography.Text>{t('assertion.datasetRowsAre')}</Typography.Text>;
        default:
            console.error(`Unsupported Dataset Rows Aggregation ${aggregation} provided`);
            return <Typography.Text>{t('assertion.datasetRowsAre')}</Typography.Text>;
    }
};

/**
 * Returns the React Component to render for the aggregation portion of the Assertion Description
 * for Assertions on Dataset Columns
 */
const getColumnAggregationText = (
    aggregation: AssertionStdAggregation | undefined | null,
    field: SchemaFieldRef | undefined,
    t: TFunction,
) => {
    let columnText = decodeSchemaField(field?.path || '');
    if (field === undefined) {
        columnText = t('common.undefined');
        console.error(`Invalid field provided for Dataset Assertion with scope Column ${JSON.stringify(field)}`);
    }
    switch (aggregation) {
        // Hybrid Aggregations
        case AssertionStdAggregation.UniqueCount: {
            return (
                <Typography.Text>
                    <Trans
                        {...{
                            i18nKey: 'assertion.uniqueValueCountForColumnIs_component',
                            values: {
                                columnText,
                            },
                            components: { typographyTextStrong: <Typography.Text strong /> },
                        }}
                    />
                </Typography.Text>
            );
        }
        case AssertionStdAggregation.UniquePropotion: {
            return (
                <Typography.Text>
                    <Trans
                        {...{
                            i18nKey: 'assertion.uniqueValueProportionForColumnIs_component',
                            values: {
                                columnText,
                            },
                            components: { typographyTextStrong: <Typography.Text strong /> },
                        }}
                    />
                </Typography.Text>
            );
        }
        case AssertionStdAggregation.NullCount: {
            return (
                <Typography.Text>
                    <Trans
                        {...{
                            i18nKey: 'assertion.nullCountForColumnIs_component',
                            values: {
                                columnText,
                            },
                            components: { typographyTextStrong: <Typography.Text strong /> },
                        }}
                    />
                </Typography.Text>
            );
        }
        case AssertionStdAggregation.NullProportion: {
            return (
                <Typography.Text>
                    <Trans
                        {...{
                            i18nKey: 'assertion.nullProportionForColumnIs_component',
                            values: {
                                columnText,
                            },
                            components: { typographyTextStrong: <Typography.Text strong /> },
                        }}
                    />
                </Typography.Text>
            );
        }
        // Numeric Aggregations
        case AssertionStdAggregation.Min: {
            return (
                <Typography.Text>
                    <Trans
                        {...{
                            i18nKey: 'assertion.minimumValueForColumnIs_component',
                            values: {
                                columnText,
                            },
                            components: { typographyTextStrong: <Typography.Text strong /> },
                        }}
                    />
                </Typography.Text>
            );
        }
        case AssertionStdAggregation.Max: {
            return (
                <Typography.Text>
                    <Trans
                        {...{
                            i18nKey: 'assertion.maximumValueForColumnIs_component',
                            values: {
                                columnText,
                            },
                            components: { typographyTextStrong: <Typography.Text strong /> },
                        }}
                    />
                </Typography.Text>
            );
        }
        case AssertionStdAggregation.Mean: {
            return (
                <Typography.Text>
                    <Trans
                        {...{
                            i18nKey: 'assertion.meanValueForColumnIs_component',
                            values: {
                                columnText,
                            },
                            components: { typographyTextStrong: <Typography.Text strong /> },
                        }}
                    />
                </Typography.Text>
            );
        }
        case AssertionStdAggregation.Median: {
            return (
                <Typography.Text>
                    <Trans
                        {...{
                            i18nKey: 'assertion.medianValueForColumnIs_component',
                            values: {
                                columnText,
                            },
                            components: { typographyTextStrong: <Typography.Text strong /> },
                        }}
                    />
                </Typography.Text>
            );
        }
        case AssertionStdAggregation.Stddev: {
            return (
                <Typography.Text>
                    <Trans
                        {...{
                            i18nKey: 'assertion.standardDeviationForColumnIs_component',
                            values: {
                                columnText,
                            },
                            components: { typographyTextStrong: <Typography.Text strong /> },
                        }}
                    />
                </Typography.Text>
            );
        }
        // Native Aggregations
        case AssertionStdAggregation.Native:
        default:
            // No aggregation on the column at hand. Treat the column as a set of values.
            return (
                <Typography.Text>
                    <Trans
                        {...{
                            i18nKey: 'assertion.columnValuesAre_component',
                            values: {
                                columnText,
                            },
                            components: { typographyTextStrong: <Typography.Text strong /> },
                        }}
                    />
                </Typography.Text>
            );
    }
};

/**
 * Returns the React Component to render for the aggregation portion of the Assertion Description
 */
const getAggregationText = (
    scope: DatasetAssertionScope,
    aggregation: AssertionStdAggregation | undefined | null,
    fields: Array<SchemaFieldRef> | undefined | null,
    t: TFunction,
) => {
    switch (scope) {
        case DatasetAssertionScope.DatasetSchema:
            return getSchemaAggregationText(aggregation, fields, t);
        case DatasetAssertionScope.DatasetRows:
            return getRowsAggregationText(aggregation, t);
        case DatasetAssertionScope.DatasetColumn:
            return getColumnAggregationText(aggregation, fields?.length === 1 ? fields[0] : undefined, t);
        default:
            console.error(`Unsupported Dataset Assertion scope ${scope} provided`);
            return t('assertion.datasetIs');
    }
};

/**
 * Returns the React Component to render for the operator portion of the Assertion Description
 */
const getOperatorText = (
    op: AssertionStdOperator,
    parameters: AssertionStdParameters | undefined,
    nativeType: string | undefined,
    t: TFunction,
) => {
    switch (op) {
        // Hybrid Operators
        case AssertionStdOperator.Between: {
            return (
                <Typography.Text>
                    <Trans
                        {...{
                            i18nKey: 'common.betweenAndLowercaseWithName_component',
                            values: {
                                name1: getFormattedParameterValue(parameters?.minValue),
                                name2: getFormattedParameterValue(parameters?.maxValue),
                            },
                            components: {
                                component1: <Typography.Text strong />,
                                component2: <Typography.Text strong />,
                            },
                        }}
                    />
                </Typography.Text>
            );
        }
        case AssertionStdOperator.EqualTo: {
            const operatorText = t('filter.equals.true');
            return (
                <Typography.Text>
                    {operatorText}{' '}
                    <Typography.Text strong>{getFormattedParameterValue(parameters?.value)}</Typography.Text>
                </Typography.Text>
            );
        }
        case AssertionStdOperator.Contain: {
            const operatorText = t('filter.contains.true');
            return (
                <Typography.Text>
                    {operatorText}{' '}
                    <Typography.Text strong>{getFormattedParameterValue(parameters?.value)} </Typography.Text>
                </Typography.Text>
            );
        }
        case AssertionStdOperator.In: {
            const operatorText = t('filter.in.true');
            return (
                <Typography.Text>
                    {operatorText}{' '}
                    <Typography.Text strong>{getFormattedParameterValue(parameters?.value)} </Typography.Text>
                </Typography.Text>
            );
        }
        case AssertionStdOperator.NotNull: {
            const operatorText = t('filter.null.false');
            return <Typography.Text strong>{operatorText}</Typography.Text>;
        }
        // Numeric Operators
        case AssertionStdOperator.GreaterThan: {
            const operatorText = t('filter.greater.true');
            return (
                <Typography.Text>
                    {operatorText}{' '}
                    <Typography.Text strong>{getFormattedParameterValue(parameters?.value)} </Typography.Text>
                </Typography.Text>
            );
        }
        case AssertionStdOperator.GreaterThanOrEqualTo: {
            const operatorText = t('filter.lower.false');
            return (
                <Typography.Text>
                    {operatorText}{' '}
                    <Typography.Text strong>{getFormattedParameterValue(parameters?.value)} </Typography.Text>
                </Typography.Text>
            );
        }
        case AssertionStdOperator.LessThan: {
            const operatorText = t('filter.less.true');
            return (
                <Typography.Text>
                    {operatorText}{' '}
                    <Typography.Text strong>{getFormattedParameterValue(parameters?.value)} </Typography.Text>
                </Typography.Text>
            );
        }
        case AssertionStdOperator.LessThanOrEqualTo: {
            const operatorText = t('less.lower.false');
            return (
                <Typography.Text>
                    {operatorText}{' '}
                    <Typography.Text strong>{getFormattedParameterValue(parameters?.value)} </Typography.Text>
                </Typography.Text>
            );
        }
        // String Operators
        case AssertionStdOperator.StartWith: {
            const operatorText = t('filter.text.startWith');
            return (
                <Typography.Text>
                    {operatorText}{' '}
                    <Typography.Text strong>{getFormattedParameterValue(parameters?.value)}</Typography.Text>
                </Typography.Text>
            );
        }
        case AssertionStdOperator.EndWith: {
            const operatorText = t('filter.text.endWith');
            return (
                <Typography.Text>
                    {operatorText}{' '}
                    <Typography.Text strong>{getFormattedParameterValue(parameters?.value)} </Typography.Text>
                </Typography.Text>
            );
        }
        case AssertionStdOperator.Native: {
            return (
                <Typography.Text>
                    {t('assertion.passingAssertion').toLowerCase()}{' '}
                    <Typography.Text strong>{nativeType}</Typography.Text>
                </Typography.Text>
            );
        }
        default:
            return (
                <Typography.Text>
                    {`${t('assertion.passingOperator').toLowerCase()} `}
                    <Typography.Text strong>
                        {`${op} ${t('common.withValue')} ${getFormattedParameterValue(parameters?.value)}`}
                    </Typography.Text>
                </Typography.Text>
            );
    }
};

const TOOLTIP_MAX_WIDTH = 440;

/**
 * A human-readable description of an Assertion.
 *
 * For example, Column 'X' values are in [1, 2, 3]
 */
export const DatasetAssertionDescription = ({ assertionInfo }: Props) => {
    const { t } = useTranslation();
    const { scope, aggregation, fields, operator, parameters, nativeType, nativeParameters, logic } = assertionInfo;
    const [isLogicVisible, setIsLogicVisible] = useState(false);
    /**
     * Build a description component from a) input (aggregation, inputs) b) the operator text
     */
    const description = (
        <>
            <Typography.Text>
                {getAggregationText(scope, aggregation, fields, t)}{' '}
                {getOperatorText(operator, parameters || undefined, nativeType || undefined, t)}
            </Typography.Text>
        </>
    );

    return (
        <Popover
            overlayStyle={{ maxWidth: TOOLTIP_MAX_WIDTH }}
            title={<Typography.Text strong>{t('common.details')}</Typography.Text>}
            content={
                <>
                    <Typography.Text strong>{t('common.type').toLowerCase()}</Typography.Text>: {nativeType || 'N/A'}
                    {nativeParameters?.map((parameter) => (
                        <div>
                            <Typography.Text strong>{parameter.key}</Typography.Text>: {parameter.value}
                        </div>
                    ))}
                </>
            }
        >
            <div>{description}</div>
            {logic && (
                <div>
                    <ViewLogicButton onClick={() => setIsLogicVisible(true)} type="link">
                        {t('assertion.viewLogic')}
                    </ViewLogicButton>
                </div>
            )}
            <DatasetAssertionLogicModal
                logic={logic || t('common.na')}
                visible={isLogicVisible}
                onClose={() => setIsLogicVisible(false)}
            />
        </Popover>
    );
};
