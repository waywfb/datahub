import { RecipeField, FieldType, setListValuesOnRecipe } from './common';

export const LOOKER_BASE_URL: RecipeField = {
    name: 'base_url',
    label: 'ingest.looker.label.baseUrl',
    tooltip: 'ingest.looker.lookerBaseUrlToolTip',
    type: FieldType.TEXT,
    fieldPath: 'source.config.base_url',
    placeholder: 'https://looker.company.com',
    required: true,
    rules: null,
};

export const LOOKER_CLIENT_ID: RecipeField = {
    name: 'client_id',
    label: 'ingest.recipeForms.label.clientID',
    tooltip: 'ingest.looker.lookerClientIDToolTip',
    type: FieldType.SECRET,
    fieldPath: 'source.config.client_id',
    placeholder: 'client_id',
    required: true,
    rules: null,
};

export const LOOKER_CLIENT_SECRET: RecipeField = {
    name: 'client_secret',
    label: 'ingest.recipeForms.label.clientSecret',
    tooltip: 'ingest.looker.lookerClientSecretToolTip',
    type: FieldType.SECRET,
    fieldPath: 'source.config.client_secret',
    placeholder: 'client_secret',
    required: true,
    rules: null,
};

const chartAllowFieldPath = 'source.config.chart_pattern.allow';
export const CHART_ALLOW: RecipeField = {
    name: 'chart_pattern.allow',
    label: 'ingest.recipeForms.label.allowPatterns',
    tooltip: 'ingest.looker.lookerAllowChartToolTip',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: chartAllowFieldPath,
    rules: null,
    section: 'ingest.looker.section.charts',
    placeholder: '12',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, chartAllowFieldPath),
};

const chartDenyFieldPath = 'source.config.chart_pattern.deny';
export const CHART_DENY: RecipeField = {
    name: 'chart_pattern.deny',
    label: 'ingest.recipeForms.label.denyPatterns',
    tooltip: 'ingest.looker.lookerDenyChartToolTip',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: chartDenyFieldPath,
    rules: null,
    section: 'ingest.looker.section.charts',
    placeholder: '12',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, chartDenyFieldPath),
};

const dashboardAllowFieldPath = 'source.config.dashboard_pattern.allow';
export const DASHBOARD_ALLOW: RecipeField = {
    name: 'dashboard_pattern.allow',
    label: 'ingest.recipeForms.label.allowPatterns',
    tooltip: 'ingest.looker.lookerAllowDashboardToolTip',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: dashboardAllowFieldPath,
    rules: null,
    section: 'ingest.recipeForms.section.dashboards',
    placeholder: '1232',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, dashboardAllowFieldPath),
};

const dashboardDenyFieldPath = 'source.config.dashboard_pattern.deny';
export const DASHBOARD_DENY: RecipeField = {
    name: 'dashboard_pattern.deny',
    label: 'ingest.recipeForms.label.denyPatterns',
    tooltip: 'ingest.looker.lookerDenyDashboardToolTip',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: dashboardDenyFieldPath,
    rules: null,
    section: 'ingest.recipeForms.section.dashboards',
    placeholder: '1232',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, dashboardDenyFieldPath),
};
