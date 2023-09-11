import i18next, { TFunction } from 'i18next';
import { SourceConfig } from './types';

export const getSourceConfigsDisplayName = (
    sourceConfigs: SourceConfig | undefined,
    t: TFunction,
): string | undefined => {
    if (sourceConfigs && sourceConfigs.displayName && i18next.exists(sourceConfigs.displayName)) {
        return t(sourceConfigs?.displayName);
    }
    return sourceConfigs?.displayName;
};
