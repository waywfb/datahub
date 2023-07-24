import React from 'react';
import { TFunction } from 'i18next';
import EntityRegistry from '../../entity/EntityRegistry';
import FilterOption from './FilterOption';
import { FilterOptionType } from './types';
import { getFilterIconAndLabel } from './utils';

export interface DisplayedFilterOption {
    key: string;
    label: React.ReactNode;
    style: any;
    displayName?: string | null;
    nestedOptions?: FilterOptionType[];
}

interface CreateFilterOptionProps {
    filterOption: FilterOptionType;
    entityRegistry: EntityRegistry;
    t: TFunction;
    selectedFilterOptions: FilterOptionType[];
    setSelectedFilterOptions: (values: FilterOptionType[]) => void;
    nestedOptions?: FilterOptionType[];
}

export function mapFilterOption({
    filterOption,
    entityRegistry,
    t,
    selectedFilterOptions,
    setSelectedFilterOptions,
    nestedOptions,
}: CreateFilterOptionProps): DisplayedFilterOption {
    const { label: displayName } = getFilterIconAndLabel(
        filterOption.field,
        filterOption.value,
        entityRegistry,
        t,
        filterOption.entity || null,
    );

    return {
        key: filterOption.value,
        label: (
            <FilterOption
                filterOption={filterOption}
                selectedFilterOptions={selectedFilterOptions}
                setSelectedFilterOptions={setSelectedFilterOptions}
                nestedOptions={nestedOptions}
            />
        ),
        style: { padding: 0 },
        displayName: displayName as string,
        nestedOptions,
    };
}
