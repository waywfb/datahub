import { TFunction } from 'i18next';
import { SourceConfig } from './types';

export const getSourceConfigsDisplayName = (
    sourceConfigs: SourceConfig | undefined,
    t: TFunction,
    i18n: any,
): string | undefined => {
    if (sourceConfigs && sourceConfigs.displayName && i18n.exists(sourceConfigs.displayName)) {
        return t(sourceConfigs?.displayName);
    }
    return sourceConfigs?.displayName;
};
