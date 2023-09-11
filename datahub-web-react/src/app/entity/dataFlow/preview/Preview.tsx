import React from 'react';
import { Typography } from 'antd';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
    DataProduct,
    Deprecation,
    Domain,
    EntityPath,
    EntityType,
    GlobalTags,
    Owner,
    SearchInsight,
} from '../../../../types.generated';
import DefaultPreviewCard from '../../../preview/DefaultPreviewCard';
import { useEntityRegistry } from '../../../useEntityRegistry';
import { IconStyleType } from '../../Entity';
import { ANTD_GRAY } from '../../shared/constants';

const StatText = styled(Typography.Text)`
    color: ${ANTD_GRAY[8]};
`;

export const Preview = ({
    urn,
    name,
    platformInstanceId,
    description,
    platformName,
    platformLogo,
    owners,
    globalTags,
    domain,
    dataProduct,
    externalUrl,
    snippet,
    insights,
    jobCount,
    deprecation,
    degree,
    paths,
}: {
    urn: string;
    name: string;
    platformInstanceId?: string;
    description?: string | null;
    platformName?: string;
    platformLogo?: string | null;
    owners?: Array<Owner> | null;
    domain?: Domain | null;
    dataProduct?: DataProduct | null;
    globalTags?: GlobalTags | null;
    deprecation?: Deprecation | null;
    externalUrl?: string | null;
    snippet?: React.ReactNode | null;
    insights?: Array<SearchInsight> | null;
    jobCount?: number | null;
    degree?: number;
    paths?: EntityPath[];
}): JSX.Element => {
    const entityRegistry = useEntityRegistry();
    const { t } = useTranslation();
    return (
        <DefaultPreviewCard
            url={entityRegistry.getEntityUrl(EntityType.DataFlow, urn)}
            name={name}
            urn={urn}
            description={description || ''}
            platformInstanceId={platformInstanceId}
            type={EntityType.DataFlow}
            typeIcon={entityRegistry.getIcon(EntityType.DataFlow, 14, IconStyleType.ACCENT)}
            platform={platformName}
            logoUrl={platformLogo || ''}
            owners={owners}
            tags={globalTags || undefined}
            domain={domain}
            dataProduct={dataProduct}
            snippet={snippet}
            insights={insights}
            externalUrl={externalUrl}
            deprecation={deprecation}
            subHeader={
                (jobCount && [
                    <StatText>
                        <b>{jobCount}</b> {entityRegistry.getCollectionNameTrans(EntityType.DataJob, t)}
                    </StatText>,
                ]) ||
                undefined
            }
            degree={degree}
            paths={paths}
        />
    );
};
