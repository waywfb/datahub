import React from 'react';
import { set, get } from 'lodash';
import moment, { Moment } from 'moment-timezone';
import { Trans } from 'react-i18next';

export enum FieldType {
    TEXT,
    BOOLEAN,
    LIST,
    SELECT,
    SECRET,
    DICT,
    TEXTAREA,
    DATE,
}

interface Option {
    label: string;
    value: string;
}

export interface RecipeField {
    name: string;
    label: string;
    tooltip: string | React.ReactNode;
    type: FieldType;
    fieldPath: string | string[];
    rules: any[] | null;
    required?: boolean; // Today, Only makes a difference on Selects
    section?: string;
    options?: Option[];
    buttonLabel?: string;
    keyField?: RecipeField;
    fields?: RecipeField[];
    getValueFromRecipeOverride?: (recipe: any) => any;
    setValueOnRecipeOverride?: (recipe: any, value: any) => any;
    placeholder?: string;
}

function clearFieldAndParents(recipe: any, fieldPath: string | string[]) {
    set(recipe, fieldPath, undefined);

    // remove last item from fieldPath
    const updatedFieldPath = Array.isArray(fieldPath)
        ? fieldPath.slice(0, -1).join('.')
        : fieldPath.split('.').slice(0, -1).join('.');

    if (updatedFieldPath) {
        const parentKeys = Object.keys(get(recipe, updatedFieldPath));

        // only child left is what we just set as undefined
        if (parentKeys.length === 1) {
            clearFieldAndParents(recipe, updatedFieldPath);
        }
    }
    return recipe;
}
export function setFieldValueOnRecipe(recipe: any, value: any, fieldPath: string | string[]) {
    const updatedRecipe = { ...recipe };
    if (value === null || value === '' || value === undefined) {
        clearFieldAndParents(updatedRecipe, fieldPath);
        return updatedRecipe;
    }
    set(updatedRecipe, fieldPath, value);
    return updatedRecipe;
}

export function setListValuesOnRecipe(recipe: any, values: string[] | undefined, fieldPath: string) {
    const updatedRecipe = { ...recipe };
    if (values !== undefined) {
        const filteredValues: string[] | undefined = values.filter((v) => !!v);
        return filteredValues.length
            ? setFieldValueOnRecipe(updatedRecipe, filteredValues, fieldPath)
            : setFieldValueOnRecipe(updatedRecipe, null, fieldPath);
    }
    return updatedRecipe;
}

const NUM_CHARACTERS_TO_REMOVE_FROM_DATE = 5;

export function setDateValueOnRecipe(recipe: any, value: Moment | undefined, fieldPath: string) {
    const updatedRecipe = { ...recipe };
    if (value !== undefined) {
        if (!value) {
            return setFieldValueOnRecipe(updatedRecipe, null, fieldPath);
        }
        const isoDateString = value.toISOString();
        const formattedDateString = isoDateString
            .substring(0, isoDateString.length - NUM_CHARACTERS_TO_REMOVE_FROM_DATE)
            .concat('Z');
        return setFieldValueOnRecipe(updatedRecipe, formattedDateString, fieldPath);
    }
    return updatedRecipe;
}

/* ---------------------------------------------------- Filter Section ---------------------------------------------------- */
const databaseAllowFieldPath = 'source.config.database_pattern.allow';
export const DATABASE_ALLOW: RecipeField = {
    name: 'database_pattern.allow',
    label: 'ingest.recipeForms.label.allowPatterns',
    tooltip: 'ingest.common.commonDatabasesAllowToolTip',
    placeholder: 'database_name',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: databaseAllowFieldPath,
    rules: null,
    section: 'ingest.common.section.databases',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, databaseAllowFieldPath),
};

const databaseDenyFieldPath = 'source.config.database_pattern.deny';
export const DATABASE_DENY: RecipeField = {
    name: 'database_pattern.deny',
    label: 'ingest.recipeForms.label.denyPatterns',
    tooltip: 'ingest.common.commonDatabasesDenyToolTip',
    placeholder: 'database_name',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: databaseDenyFieldPath,
    rules: null,
    section: 'ingest.common.section.databases',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, databaseDenyFieldPath),
};

const dashboardAllowFieldPath = 'source.config.dashboard_pattern.allow';
export const DASHBOARD_ALLOW: RecipeField = {
    name: 'dashboard_pattern.allow',
    label: 'ingest.recipeForms.label.allowPatterns',
    tooltip: 'ingest.common.commonDashboardAllowToolTip',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: dashboardAllowFieldPath,
    rules: null,
    section: 'ingest.recipeForms.section.dashboards',
    placeholder: 'my_dashboard',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, dashboardAllowFieldPath),
};

const dashboardDenyFieldPath = 'source.config.dashboard_pattern.deny';
export const DASHBOARD_DENY: RecipeField = {
    name: 'dashboard_pattern.deny',
    label: 'ingest.recipeForms.label.denyPatterns',
    tooltip: 'ingest.common.commonDashboardDenyToolTip',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: dashboardDenyFieldPath,
    rules: null,
    section: 'ingest.recipeForms.section.dashboards',
    placeholder: 'my_dashboard',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, dashboardDenyFieldPath),
};

const schemaAllowFieldPath = 'source.config.schema_pattern.allow';
export const SCHEMA_ALLOW: RecipeField = {
    name: 'schema_pattern.allow',
    label: 'ingest.recipeForms.label.allowPatterns',
    // TODO: Change this to FULLY qualified names once the allow / deny consistency track is completed.
    tooltip: 'ingest.common.commonSchemaAllowToolTip',
    placeholder: 'company_schema',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: schemaAllowFieldPath,
    rules: null,
    section: 'ingest.common.section.schemas',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, schemaAllowFieldPath),
};

const schemaDenyFieldPath = 'source.config.schema_pattern.deny';
export const SCHEMA_DENY: RecipeField = {
    name: 'schema_pattern.deny',
    label: 'ingest.recipeForms.label.denyPatterns',
    tooltip: 'ingest.common.commonSchemaDenyToolTip',
    placeholder: 'company_schema',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: schemaDenyFieldPath,
    rules: null,
    section: 'ingest.common.section.schemas',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, schemaDenyFieldPath),
};

const tableAllowFieldPath = 'source.config.table_pattern.allow';
export const TABLE_ALLOW: RecipeField = {
    name: 'table_pattern.allow',
    label: 'ingest.recipeForms.label.allowPatterns',
    tooltip: 'ingest.common.commonTableAllowToolTip',
    placeholder: 'database_name.company_schema.table_name',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: tableAllowFieldPath,
    rules: null,
    section: 'ingest.recipeForms.section.tables',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, tableAllowFieldPath),
};

const tableDenyFieldPath = 'source.config.table_pattern.deny';
export const TABLE_DENY: RecipeField = {
    name: 'table_pattern.deny',
    label: 'ingest.recipeForms.label.denyPatterns',
    tooltip: 'ingest.common.commonTableDenyToolTip',
    placeholder: 'database_name.company_schema.table_name',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: tableDenyFieldPath,
    rules: null,
    section: 'ingest.recipeForms.section.tables',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, tableDenyFieldPath),
};

const viewAllowFieldPath = 'source.config.view_pattern.allow';
export const VIEW_ALLOW: RecipeField = {
    name: 'view_pattern.allow',
    label: 'ingest.recipeForms.label.allowPatterns',
    tooltip: 'ingest.common.commonViewAllowToolTip',
    placeholder: 'database_name.company_schema.view_name',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: viewAllowFieldPath,
    rules: null,
    section: 'ingest.common.section.views',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, viewAllowFieldPath),
};

const viewDenyFieldPath = 'source.config.view_pattern.deny';
export const VIEW_DENY: RecipeField = {
    name: 'view_pattern.deny',
    label: 'ingest.recipeForms.label.denyPatterns',
    tooltip: 'ingest.common.commonViewDenyToolTip',
    placeholder: 'database_name.company_schema.view_name',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: viewDenyFieldPath,
    rules: null,
    section: 'ingest.common.section.views',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, viewDenyFieldPath),
};

/* ---------------------------------------------------- Advance Section ---------------------------------------------------- */
const includeLineageFieldPathA = 'source.config.include_table_lineage';
const includeLineageFieldPathB = 'source.config.include_view_lineage';
export const INCLUDE_LINEAGE: RecipeField = {
    name: 'include_lineage',
    label: 'ingest.recipeForms.label.includeLineage',
    tooltip: 'ingest.common.commonIncludeLineageToolTip',
    type: FieldType.BOOLEAN,
    fieldPath: includeLineageFieldPathA,
    rules: null,
    getValueFromRecipeOverride: (recipe: any) =>
        get(recipe, includeLineageFieldPathA) && get(recipe, includeLineageFieldPathB),
    setValueOnRecipeOverride: (recipe: any, value: boolean) => {
        let updatedRecipe = setFieldValueOnRecipe(recipe, value, includeLineageFieldPathA);
        updatedRecipe = setFieldValueOnRecipe(updatedRecipe, value, includeLineageFieldPathB);
        return updatedRecipe;
    },
};

export const INCLUDE_TABLE_LINEAGE: RecipeField = {
    name: 'include_table_lineage',
    label: 'Include Table Lineage',
    tooltip: 'ingest.common.commonIncludeTableLineageToolTip',
    type: FieldType.BOOLEAN,
    fieldPath: 'source.config.include_table_lineage',
    rules: null,
};

const isProfilingEnabledFieldPath = 'source.config.profiling.enabled';
export const TABLE_PROFILING_ENABLED: RecipeField = {
    name: 'profiling.enabled',
    label: 'ingest.common.label.enableTableProfiling',
    tooltip: 'ingest.common.commonEnableTableProfilingToolTip',
    type: FieldType.BOOLEAN,
    fieldPath: isProfilingEnabledFieldPath,
    rules: null,
};

const isTableProfilingOnlyFieldPath = 'source.config.profiling.profile_table_level_only';
export const COLUMN_PROFILING_ENABLED: RecipeField = {
    name: 'column_profiling.enabled',
    label: 'ingest.common.label.enableColumnProfiling',
    tooltip: 'ingest.common.commonEnableColumnProfilingToolTip',
    type: FieldType.BOOLEAN,
    fieldPath: isTableProfilingOnlyFieldPath,
    rules: null,
    getValueFromRecipeOverride: (recipe: any) => {
        return get(recipe, isProfilingEnabledFieldPath) && !get(recipe, isTableProfilingOnlyFieldPath);
    },
    setValueOnRecipeOverride: (recipe: any, value: boolean) => {
        return setFieldValueOnRecipe(recipe, !value, isTableProfilingOnlyFieldPath);
    },
};

export const STATEFUL_INGESTION_ENABLED: RecipeField = {
    name: 'stateful_ingestion.enabled',
    label: 'ingest.common.label.enableStatefulIngestion',
    tooltip: 'ingest.common.commonEnableStatefulIngestionToolTip',
    type: FieldType.BOOLEAN,
    fieldPath: 'source.config.stateful_ingestion.enabled',
    rules: null,
};

export const UPSTREAM_LINEAGE_IN_REPORT: RecipeField = {
    name: 'upstream_lineage_in_report',
    label: 'ingest.common.label.includeUpstreamLineageInReport',
    tooltip: 'ingest.common.commonIncludeUpstreamLineageInReportToolTip',
    type: FieldType.BOOLEAN,
    fieldPath: 'source.config.upstream_lineage_in_report',
    rules: null,
};

export const TABLE_LINEAGE_MODE: RecipeField = {
    name: 'table_lineage_mode',
    label: 'ingest.common.label.tableLineageMode',
    tooltip: (
        <div>
            <p>
                <Trans
                    {...{
                        i18nKey: 'ingest.common.commonTableLineageModeToolTip',
                        components: {
                            aLink: (
                                // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
                                <a
                                    href="https://datahubproject.io/docs/generated/ingestion/sources/redshift/#config-details"
                                    target="_blank"
                                    rel="noreferrer"
                                />
                            ),
                        },
                    }}
                />
            </p>
        </div>
    ),
    type: FieldType.SELECT,
    fieldPath: 'source.config.table_lineage_mode',
    rules: null,
    options: [
        { label: 'stl_scan_based', value: 'stl_scan_based' },
        { label: 'sql_based', value: 'sql_based' },
        { label: 'mixed', value: 'mixed' },
    ],
};

export const INGEST_TAGS: RecipeField = {
    name: 'ingest_tags',
    label: 'ingest.common.label.ingestTags',
    tooltip: 'ingest.common.commonIngestTagsToolTip',
    type: FieldType.BOOLEAN,
    fieldPath: 'source.config.ingest_tags',
    rules: null,
};

export const INGEST_OWNER: RecipeField = {
    name: 'ingest_owner',
    label: 'ingest.common.label.ingestOwner',
    tooltip: 'ingest.common.commonIngestOwnerToolTip',
    type: FieldType.BOOLEAN,
    fieldPath: 'source.config.ingest_owner',
    rules: null,
};

const includeTablesPath = 'source.config.include_tables';
export const INCLUDE_TABLES: RecipeField = {
    name: 'include_tables',
    label: 'ingest.common.label.includeTables',
    tooltip: 'ingest.common.commonIncludeTablesToolTip',
    type: FieldType.BOOLEAN,
    fieldPath: includeTablesPath,
    // Always set include views indicator to true by default.
    // This is in accordance with what the ingestion sources do.
    getValueFromRecipeOverride: (recipe: any) => {
        const includeTables = get(recipe, includeTablesPath);
        if (includeTables !== undefined && includeTables !== null) {
            return includeTables;
        }
        return true;
    },
    rules: null,
};

const includeViewsPath = 'source.config.include_views';
export const INCLUDE_VIEWS: RecipeField = {
    name: 'include_views',
    label: 'ingest.common.label.includeViews',
    tooltip: 'ingest.common.commonIncludeViewsToolTip',
    type: FieldType.BOOLEAN,
    fieldPath: includeViewsPath,
    // Always set include views indicator to true by default.
    // This is in accordance with what the ingestion sources do.
    getValueFromRecipeOverride: (recipe: any) => {
        const includeViews = get(recipe, includeViewsPath);
        if (includeViews !== undefined && includeViews !== null) {
            return includeViews;
        }
        return true;
    },
    rules: null,
};

export const GITHUB_INFO_REPO: RecipeField = {
    name: 'github_info.repo',
    label: 'ingest.recipeForms.label.githubRepo',
    tooltip: (
        <div>
            <p>
                <Trans
                    {...{
                        i18nKey: 'ingest.common.commonGithubRepoToolTip',
                        components: {
                            paraph: <p />,
                            bold: <strong />,
                            aLink: (
                                // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
                                <a href="https://github.com/datahub-project/datahub" target="_blank" rel="noreferrer" />
                            ),
                        },
                    }}
                />
            </p>
        </div>
    ),
    type: FieldType.TEXT,
    fieldPath: 'source.config.github_info.repo',
    rules: null,
};

export const EXTRACT_USAGE_HISTORY: RecipeField = {
    name: 'extract_usage_history',
    label: 'ingest.common.label.extractUsageHistory',
    tooltip: 'ingest.common.commonExtractUsageHistoryToolTip',
    type: FieldType.BOOLEAN,
    fieldPath: 'source.config.extract_usage_history',
    rules: null,
};

export const EXTRACT_OWNERS: RecipeField = {
    name: 'extract_owners',
    label: 'ingest.recipeForms.label.extractOwners',
    tooltip: 'ingest.common.commonExtractOwnersToolTip',
    type: FieldType.BOOLEAN,
    fieldPath: 'source.config.extract_owners',
    rules: null,
};

export const SKIP_PERSONAL_FOLDERS: RecipeField = {
    name: 'skip_personal_folders',
    label: 'ingest.common.label.skipPersonalFolders',
    tooltip: 'ingest.common.commonSkipPersonalFoldersToolTip',
    type: FieldType.BOOLEAN,
    fieldPath: 'source.config.skip_personal_folders',
    rules: null,
};

const startTimeFieldPath = 'source.config.start_time';
export const START_TIME: RecipeField = {
    name: 'start_time',
    label: 'ingest.common.label.startTime',
    tooltip: 'ingest.common.commonStartTimeToolTip',
    placeholder: 'Select date and time',
    type: FieldType.DATE,
    fieldPath: startTimeFieldPath,
    rules: null,
    getValueFromRecipeOverride: (recipe: any) => {
        const isoDateString = get(recipe, startTimeFieldPath);
        if (isoDateString) {
            return moment(isoDateString);
        }
        return isoDateString;
    },
    setValueOnRecipeOverride: (recipe: any, value?: Moment) => setDateValueOnRecipe(recipe, value, startTimeFieldPath),
};
