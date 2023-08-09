import React from 'react';

import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { InputFields, MatchedField, Maybe } from '../../../types.generated';
import TagTermGroup from '../../shared/tags/TagTermGroup';
import { FIELDS_TO_HIGHLIGHT } from '../dataset/search/highlights';
import { getMatchPrioritizingPrimary } from '../shared/utils';

type Props = {
    matchedFields: MatchedField[];
    inputFields: Maybe<InputFields> | undefined;
    isMatchingDashboard?: boolean;
};

const LABEL_INDEX_NAME = 'fieldLabels';
const TYPE_PROPERTY_KEY_NAME = 'type';

export const ChartSnippet = ({ matchedFields, inputFields, isMatchingDashboard = false }: Props) => {
    const { t } = useTranslation();
    const matchedField = getMatchPrioritizingPrimary(matchedFields, 'fieldLabels');

    if (matchedField?.name === LABEL_INDEX_NAME) {
        const matchedSchemaField = inputFields?.fields?.find(
            (field) => field?.schemaField?.label === matchedField.value,
        );
        const matchedGlossaryTerm = matchedSchemaField?.schemaField?.glossaryTerms?.terms?.find(
            (term) => term?.term?.name === matchedField.value,
        );

        if (matchedGlossaryTerm) {
            let termType = t('entity.type.GLOSSARY_TERM', { count: 1 });
            const typeProperty = matchedGlossaryTerm.term.properties?.customProperties?.find(
                (property) => property.key === TYPE_PROPERTY_KEY_NAME,
            );
            if (typeProperty) {
                termType = typeProperty.value || termType;
            }

            return (
                <Typography.Text>
                    Matches {termType} <TagTermGroup uneditableGlossaryTerms={{ terms: [matchedGlossaryTerm] }} />{' '}
                    {isMatchingDashboard && t('chart.onAContainedChart')}
                </Typography.Text>
            );
        }
    }

    return matchedField ? (
        <Typography.Text>
            Matches {FIELDS_TO_HIGHLIGHT.get(matchedField.name)} <b>{matchedField.value}</b>{' '}
            {isMatchingDashboard && t('chart.onAContainedChart')}
        </Typography.Text>
    ) : null;
};
