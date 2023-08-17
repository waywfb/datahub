import React from 'react';
import { Typography } from 'antd';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ANTD_GRAY } from '../../../constants';

export const EntityCountText = styled(Typography.Text)`
    display: inline-block;
    font-size: 12px;
    line-height: 20px;
    font-weight: 400;
    color: ${ANTD_GRAY[7]};
`;

interface Props {
    entityCount?: number;
    displayAssetsText?: boolean;
}

function EntityCount(props: Props) {
    const { t } = useTranslation();
    const { entityCount, displayAssetsText } = props;

    if (!entityCount || entityCount <= 0) return null;

    return (
        <EntityCountText className="entityCount">
            {`${entityCount.toLocaleString()} ${t(
                displayAssetsText ? 'entity.subtype.asset_interval_interval' : 'entity.subtype.entity',
                { postProcess: 'interval', count: entityCount },
            )}`}
        </EntityCountText>
    );
}

export default EntityCount;
