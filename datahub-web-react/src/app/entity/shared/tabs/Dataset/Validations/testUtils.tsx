import React from 'react';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { TFunction } from 'i18next';
import { TestResultType } from '../../../../../../types.generated';

/**
 * Returns the display text assoociated with an Test Result Type
 */
export const getResultText = (result: TestResultType, t: TFunction) => {
    switch (result) {
        case TestResultType.Success:
            return t('test.passing');
        case TestResultType.Failure:
            return t('test.failing');
        default:
            throw new Error(t('error.unsupportedTestResultType', { result }));
    }
};

/**
 * Returns the display color assoociated with an TestResultType
 */
const SUCCESS_COLOR_HEX = '#4db31b';
const FAILURE_COLOR_HEX = '#F5222D';

export const getResultColor = (result: TestResultType, t: TFunction) => {
    switch (result) {
        case TestResultType.Success:
            return SUCCESS_COLOR_HEX;
        case TestResultType.Failure:
            return FAILURE_COLOR_HEX;
        default:
            throw new Error(t('error.unsupportedTestResultType', { result }));
    }
};

/**
 * Returns the display icon assoociated with an TestResultType
 */
export const getResultIcon = (result: TestResultType, t: TFunction) => {
    const resultColor = getResultColor(result, t);
    switch (result) {
        case TestResultType.Success:
            return <CheckCircleOutlined style={{ color: resultColor }} />;
        case TestResultType.Failure:
            return <CloseCircleOutlined style={{ color: resultColor }} />;
        default:
            throw new Error(t('error.unsupportedTestResultType', { result }));
    }
};
