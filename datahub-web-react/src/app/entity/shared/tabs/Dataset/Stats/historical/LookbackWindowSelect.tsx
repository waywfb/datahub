import React from 'react';
import { SelectValue } from 'antd/lib/select';
import { TFunction } from 'i18next';
import { LookbackWindow, LOOKBACK_WINDOWS } from '../lookbackWindows';
import PrefixedSelect from './shared/PrefixedSelect';

type Props = {
    lookbackWindow: LookbackWindow;
    setLookbackWindow: (window: LookbackWindow) => void;
    t: TFunction;
};

export default function LookbackWindowSelect({ lookbackWindow, setLookbackWindow, t }: Props) {
    const onChangeLookbackWindow = (value: SelectValue) => {
        const newLookbackWindow = Object.values(LOOKBACK_WINDOWS).filter((window) => window.value === value?.valueOf());
        setLookbackWindow(newLookbackWindow[0]);
    };

    return (
        <PrefixedSelect
            prefixText="Profiling history for past "
            values={Object.values(LOOKBACK_WINDOWS).map((window) => ({
                label: t(lookbackWindow.translateKey, { count: lookbackWindow.windowSize.count }),
                value: window.value,
            }))}
            value={lookbackWindow.value}
            setValue={onChangeLookbackWindow}
        />
    );
}
