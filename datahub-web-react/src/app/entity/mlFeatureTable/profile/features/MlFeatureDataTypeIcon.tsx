import {
    UnorderedListOutlined,
    FieldStringOutlined,
    ClockCircleOutlined,
    QuestionOutlined,
    StopOutlined,
    OrderedListOutlined,
    NumberOutlined,
    AudioOutlined,
    VideoCameraOutlined,
    FileImageOutlined,
    FieldBinaryOutlined,
    LineChartOutlined,
} from '@ant-design/icons';
import { Tooltip, Typography } from 'antd';
import React, { FC } from 'react';
import { VscFileBinary } from 'react-icons/vsc';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { capitalizeFirstLetter } from '../../../../shared/textUtil';
import { MlFeatureDataType } from '../../../../../types.generated';

const TypeIconContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    margin-top: 2.5px;
    width: 70px;
`;

const TypeSubtitle = styled(Typography.Text)<{ hasicon?: string }>`
    font-size: 8px;
    text-align: center;
    text-transform: uppercase;
    ${(props) => (props.hasicon ? '' : 'margin-top: 4px;')}
`;

const IconSpan = styled.span`
    font-size: 18px;
`;

const DATA_TYPE_ICON_MAP: Record<
    MlFeatureDataType,
    { icon: FC<{ style: any }> | null; size: number; transKey: string }
> = {
    [MlFeatureDataType.Byte]: {
        icon: () => (
            <IconSpan role="img" aria-label="calendar" className="anticon anticon-calendar">
                <VscFileBinary />
            </IconSpan>
        ),
        size: 18,
        transKey: 'common.byte',
    },
    [MlFeatureDataType.Time]: { icon: ClockCircleOutlined, size: 18, transKey: 'common.time' },
    [MlFeatureDataType.Set]: { icon: UnorderedListOutlined, size: 18, transKey: 'common.set' },
    [MlFeatureDataType.Unknown]: { icon: QuestionOutlined, size: 16, transKey: 'common.unknown' },
    [MlFeatureDataType.Map]: { icon: UnorderedListOutlined, size: 14, transKey: 'common.map' },
    [MlFeatureDataType.Useless]: { icon: StopOutlined, size: 18, transKey: 'common.useless' },
    [MlFeatureDataType.Nominal]: { icon: NumberOutlined, size: 14, transKey: 'common.nominal' },
    [MlFeatureDataType.Ordinal]: { icon: OrderedListOutlined, size: 18, transKey: 'common.ordinal' },
    [MlFeatureDataType.Binary]: { icon: FieldBinaryOutlined, size: 16, transKey: 'common.binary' },
    [MlFeatureDataType.Count]: { icon: NumberOutlined, size: 14, transKey: 'common.count' },
    [MlFeatureDataType.Interval]: { icon: ClockCircleOutlined, size: 16, transKey: 'common.interval' },
    [MlFeatureDataType.Image]: { icon: FileImageOutlined, size: 16, transKey: 'common.image' },
    [MlFeatureDataType.Video]: { icon: VideoCameraOutlined, size: 16, transKey: 'common.video' },
    [MlFeatureDataType.Audio]: { icon: AudioOutlined, size: 16, transKey: 'common.audio' },
    [MlFeatureDataType.Text]: { icon: FieldStringOutlined, size: 18, transKey: 'common.text' },
    [MlFeatureDataType.Sequence]: { icon: OrderedListOutlined, size: 16, transKey: 'common.sequence' },
    [MlFeatureDataType.Continuous]: { icon: LineChartOutlined, size: 16, transKey: 'common.continuous' },
};

type Props = {
    dataType?: MlFeatureDataType;
};

export default function MlFeatureDataTypeIcon({ dataType }: Props) {
    const { t } = useTranslation();
    const { icon: Icon, size, transKey } = DATA_TYPE_ICON_MAP[dataType || MlFeatureDataType.Unknown];

    // eslint-disable-next-line react/prop-types
    const NativeDataTypeTooltip = ({ children }) => (
        <Tooltip placement="top" title={capitalizeFirstLetter(t(transKey))}>
            {children}
        </Tooltip>
    );

    return (
        <NativeDataTypeTooltip>
            <TypeIconContainer>
                {Icon && <Icon style={{ fontSize: size }} />}
                <TypeSubtitle type="secondary" hasicon={Icon ? 'yes' : undefined}>
                    {t(transKey)}
                </TypeSubtitle>
            </TypeIconContainer>
        </NativeDataTypeTooltip>
    );
}
