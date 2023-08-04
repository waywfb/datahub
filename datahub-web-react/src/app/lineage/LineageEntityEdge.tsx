import React from 'react';
import { Tooltip } from 'antd';
import { ClockCircleOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import styled from 'styled-components';
import { Group } from '@vx/group';
import { curveBasis } from '@vx/curve';
import { LinePath } from '@vx/shape';
import { useTranslation } from 'react-i18next';
import { VizEdge } from './types';
import { ANTD_GRAY } from '../entity/shared/constants';

dayjs.extend(LocalizedFormat);

const EdgeTimestamp = styled.div``;

const StyledClockCircleOutlined = styled(ClockCircleOutlined)`
    margin-right: 4px;
    font-size: 14px;
`;

const StyledEyeOutlined = styled(EyeOutlined)`
    margin-right: 4px;
    font-size: 14px;
`;

type Props = {
    edge: VizEdge;
    key: string;
    isHighlighted: boolean;
};

export default function LineageEntityEdge({ edge, key, isHighlighted }: Props) {
    const { t } = useTranslation();
    const createdOnTimestamp = edge?.createdOn;
    const updatedOnTimestamp = edge?.updatedOn;
    const createdOn = createdOnTimestamp ? dayjs(createdOnTimestamp).format('ll') : undefined;
    const updatedOn = updatedOnTimestamp ? dayjs(updatedOnTimestamp).format('ll') : undefined;
    const hasTimestamps = createdOn || updatedOn;
    const isManual = edge?.isManual;

    return (
        <>
            <Tooltip
                title={
                    (hasTimestamps && (
                        <>
                            {createdOn && (
                                <EdgeTimestamp>
                                    <StyledClockCircleOutlined />{' '}
                                    {t('reporting.createdOnDateWithText', {
                                        text: `${t('common.manually').toLowerCase()} `,
                                        date: createdOn,
                                    })}
                                </EdgeTimestamp>
                            )}
                            {updatedOn && !isManual && (
                                <EdgeTimestamp>
                                    <StyledEyeOutlined /> {t('reporting.lastObservedOnDate', { date: updatedOn })}
                                </EdgeTimestamp>
                            )}
                        </>
                    )) ||
                    undefined
                }
            >
                <Group key={key}>
                    <LinePath
                        // we rotated the svg 90 degrees so we need to switch x & y for the last mile
                        x={(d) => {
                            // setX(d.y);
                            return d.y;
                        }}
                        y={(d) => {
                            // setY(d.x);
                            return d.x;
                        }}
                        curve={curveBasis}
                        data={edge.curve}
                        stroke={isHighlighted ? '#1890FF' : ANTD_GRAY[6]}
                        strokeWidth="1"
                        markerEnd={`url(#triangle-downstream${isHighlighted ? '-highlighted' : ''})`}
                        markerStart={`url(#triangle-upstream${isHighlighted ? '-highlighted' : ''})`}
                        data-testid={`edge-${edge.source.data.urn}-${edge.target.data.urn}-${edge.target.direction}`}
                        strokeDasharray={isManual ? '5, 5' : 'none'}
                    />
                </Group>
            </Tooltip>
        </>
    );
}
