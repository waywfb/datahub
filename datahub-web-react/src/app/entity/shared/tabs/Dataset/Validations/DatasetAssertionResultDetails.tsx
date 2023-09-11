import { Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AssertionResult } from '../../../../../../types.generated';

type Props = {
    result: AssertionResult;
};

export const DatasetAssertionResultDetails = ({ result }: Props) => {
    const { t } = useTranslation();
    const maybeActualValue = result.actualAggValue;
    const maybeUnexpectedCount = result.unexpectedCount;
    const maybeRowCount = result.rowCount;
    const maybeNativeResults = result.nativeResults;
    return (
        <>
            {maybeActualValue !== null && maybeActualValue !== undefined && (
                <div>
                    <Typography.Text strong>{t('common.actual')}</Typography.Text>: {maybeActualValue}
                </div>
            )}
            {maybeUnexpectedCount !== null && maybeUnexpectedCount !== undefined && (
                <div>
                    <Typography.Text strong>{t('assertion.invalidCount')}</Typography.Text>: {maybeUnexpectedCount}
                </div>
            )}
            {maybeRowCount !== null && maybeRowCount !== undefined && (
                <div>
                    <Typography.Text strong>{t('common.rowCount')}</Typography.Text>: {maybeRowCount}
                </div>
            )}
            {maybeNativeResults && (
                <div>
                    {maybeNativeResults.map((entry) => (
                        <div>
                            <Typography.Text strong>{entry.key}</Typography.Text>: {entry.value}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};
