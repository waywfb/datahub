import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useEntityRegistry } from '../../../../useEntityRegistry';
import FailingEntity from './FailingEntity';
import { getNumAssertionsFailing, UpstreamSummary } from './utils';

const FailingSectionWrapper = styled.div`
    margin: 5px 0 0 34px;
    font-size: 14px;
    color: black;
`;

const FailingDataWrapper = styled.div`
    margin-left: 20px;
`;

interface Props {
    upstreamSummary: UpstreamSummary;
}

export default function FailingAssertions({ upstreamSummary }: Props) {
    const { datasetsWithFailingAssertions } = upstreamSummary;
    const entityRegistry = useEntityRegistry();
    const { t } = useTranslation();

    return (
        <FailingSectionWrapper>
            {t('entity.nbrDataSourceWithFailedAssertion_interval', {
                postProcess: 'interval',
                count: datasetsWithFailingAssertions.length,
            })}
            <FailingDataWrapper>
                {datasetsWithFailingAssertions.map((dataset) => {
                    const totalNumAssertions = dataset.assertions?.assertions.length;
                    const numAssertionsFailing = getNumAssertionsFailing(dataset);

                    return (
                        <FailingEntity
                            link={entityRegistry.getEntityUrl(dataset.type, dataset.urn)}
                            displayName={entityRegistry.getDisplayName(dataset.type, dataset)}
                            contentText={`${numAssertionsFailing} of ${totalNumAssertions} failing`}
                        />
                    );
                })}
            </FailingDataWrapper>
        </FailingSectionWrapper>
    );
}
