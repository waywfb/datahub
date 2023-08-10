import { get } from 'lodash';

import { RecipeField, FieldType, setListValuesOnRecipe } from './common';

export const POWERBI_CLIENT_ID: RecipeField = {
    name: 'client_id',
    label: 'ingest.recipeForms.label.clientID',
    tooltip: 'ingest.powerBI.powerBIAzureClientIDToolTip',
    type: FieldType.TEXT,
    fieldPath: 'source.config.client_id',
    placeholder: 'client id',
    required: true,
    rules: null,
};

export const POWERBI_CLIENT_SECRET: RecipeField = {
    name: 'client_secret',
    label: 'ingest.recipeForms.label.clientSecret',
    tooltip: 'ingest.powerBI.powerBIAzureClientSecretToolTip',
    type: FieldType.SECRET,
    fieldPath: 'source.config.client_secret',
    placeholder: 'client secret',
    required: true,
    rules: null,
};

export const POWERBI_TENANT_ID: RecipeField = {
    name: 'tenant_id',
    label: 'ingest.powerBI.label.tenantID',
    tooltip: 'ingest.powerBI.powerBIAzureTenantIDToolTip',
    type: FieldType.TEXT,
    fieldPath: 'source.config.tenant_id',
    placeholder: 'a949d688-67c0-4bf1-a344-e939411c6c0a',
    required: true,
    rules: null,
};

const includeWorkspacesPath = 'source.config.extract_workspaces_to_containers';
export const INCLUDE_WORKSPACES: RecipeField = {
    name: 'extract_workspaces_to_containers',
    label: 'ingest.powerBI.label.includeWorkspace',
    tooltip: 'ingest.powerBI.powerBIIncludeWorkspaceToolTip',
    type: FieldType.BOOLEAN,
    fieldPath: includeWorkspacesPath,
    getValueFromRecipeOverride: (recipe: any) => {
        const includeWorkspaces = get(recipe, includeWorkspacesPath);
        if (includeWorkspaces !== undefined && includeWorkspaces !== null) {
            return includeWorkspaces;
        }
        return true;
    },
    rules: null,
};

const adminsApisOnlyPath = 'source.config.admin_apis_only';
export const ADMIN_APIS_ONLY: RecipeField = {
    name: 'admin_apis_only',
    label: 'ingest.powerBI.label.useAdminAPIOnly',
    tooltip: 'ingest.powerBI.powerBIUseAdminAPIOnlyToolTip',
    type: FieldType.BOOLEAN,
    fieldPath: adminsApisOnlyPath,
    getValueFromRecipeOverride: (recipe: any) => {
        const adminApisOnly = get(recipe, adminsApisOnlyPath);
        if (adminApisOnly !== undefined && adminApisOnly !== null) {
            return adminApisOnly;
        }
        return false;
    },
    rules: null,
};

const includeReportsPath = 'source.config.extract_reports';
export const INCLUDE_REPORTS: RecipeField = {
    name: 'extract_reports',
    label: 'ingest.powerBI.label.includeReports',
    tooltip: 'ingest.powerBI.powerBIIncludeReportsToolTip',
    type: FieldType.BOOLEAN,
    fieldPath: includeReportsPath,
    getValueFromRecipeOverride: (recipe: any) => {
        const includeReports = get(recipe, includeReportsPath);
        if (includeReports !== undefined && includeReports !== null) {
            return includeReports;
        }
        return true;
    },
    rules: null,
};

const includeLineagePath = 'source.config.extract_lineage';
export const INCLUDE_POWERBI_LINEAGE: RecipeField = {
    name: 'include_powerbi_lineage',
    label: 'ingest.recipeForms.label.includeLineage',
    tooltip: 'ingest.powerBI.powerBIIncludeLineageToolTip',
    type: FieldType.BOOLEAN,
    fieldPath: includeLineagePath,
    getValueFromRecipeOverride: (recipe: any) => {
        const includeLineage = get(recipe, includeLineagePath);
        if (includeLineage !== undefined && includeLineage !== null) {
            return includeLineage;
        }
        return true;
    },
    rules: null,
};

const extractEndorsementsAsTags = 'source.config.extract_endorsements_to_tags';
export const EXTRACT_ENDORSEMENTS_AS_TAGS: RecipeField = {
    name: 'extract_endorsements_to_tags',
    label: 'ingest.powerBI.label.extractEndorsementsAsTags',
    tooltip: 'ingest.powerBI.powerBIExtractEndorsementsAsTagsToolTip',
    type: FieldType.BOOLEAN,
    fieldPath: extractEndorsementsAsTags,
    getValueFromRecipeOverride: (recipe: any) => {
        const extractEndorsements = get(recipe, extractEndorsementsAsTags);
        if (extractEndorsements !== undefined && extractEndorsements !== null) {
            return extractEndorsements;
        }
        return false;
    },
    rules: null,
};

const extractOwnershipPath = 'source.config.extract_ownership';
export const EXTRACT_OWNERSHIP: RecipeField = {
    name: 'extract_ownership',
    label: 'ingest.powerBI.label.extractOwnership',
    tooltip: 'ingest.powerBI.powerBIExtractOwnershipToolTip',
    type: FieldType.BOOLEAN,
    fieldPath: extractOwnershipPath,
    getValueFromRecipeOverride: (recipe: any) => {
        const extractOwnership = get(recipe, extractOwnershipPath);
        if (extractOwnership !== undefined && extractOwnership !== null) {
            return extractOwnership;
        }
        return false;
    },
    rules: null,
};

const workspaceIdAllowFieldPath = 'source.config.workspace_id_pattern.allow';
export const WORKSPACE_ID_ALLOW: RecipeField = {
    name: 'workspace_id_pattern.allow',
    label: 'ingest.recipeForms.label.allowPatterns',
    tooltip: 'ingest.powerBI.powerBIAllowPatternToolTip',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: workspaceIdAllowFieldPath,
    rules: null,
    section: 'ingest.powerBI.section.workspaces',
    placeholder: '4bd10256-e999-45dd-8e56-571c77153a5f',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, workspaceIdAllowFieldPath),
};

const workspaceIdDenyFieldPath = 'source.config.workspace_id_pattern.deny';
export const WORKSPACE_ID_DENY: RecipeField = {
    name: 'workspace_id_pattern.deny',
    label: 'ingest.recipeForms.label.denyPatterns',
    tooltip: 'ingest.powerBI.powerBIDenyPatternToolTip',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: workspaceIdDenyFieldPath,
    rules: null,
    section: 'ingest.powerBI.section.workspaces',
    placeholder: '4bd10256-e999-45dd-8e56-571c77153a5f',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, workspaceIdDenyFieldPath),
};
