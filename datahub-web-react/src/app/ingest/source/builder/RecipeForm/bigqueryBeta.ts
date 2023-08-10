import { FieldType, RecipeField, setListValuesOnRecipe } from './common';

export const BIGQUERY_BETA_PROJECT_ID: RecipeField = {
    name: 'credential.project_id',
    label: 'ingest.recipeForms.label.projectID',
    tooltip: 'ingest.bigqueryBeta.bigqueryBetaProjectIdToolTip',
    placeholder: 'my-project-123',
    type: FieldType.TEXT,
    fieldPath: 'source.config.credential.project_id',
    rules: null,
    required: true,
};

const projectIdAllowFieldPath = 'source.config.project_id_pattern.allow';
export const PROJECT_ALLOW: RecipeField = {
    name: 'project_id_pattern.allow',
    label: 'ingest.recipeForms.label.allowPatterns',
    tooltip: 'ingest.bigqueryBeta.bigqueryBetaProjectAllowToolTip',
    placeholder: '^my_db$',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: projectIdAllowFieldPath,
    rules: null,
    section: 'ingest.bigqueryBeta.section.projects',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, projectIdAllowFieldPath),
};

const projectIdDenyFieldPath = 'source.config.project_id_pattern.deny';
export const PROJECT_DENY: RecipeField = {
    name: 'project_id_pattern.deny',
    label: 'ingest.recipeForms.label.denyPatterns',
    tooltip: 'ingest.bigqueryBeta.bigqueryBetaProjectDenyToolTip',
    placeholder: '^my_db$',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: projectIdDenyFieldPath,
    rules: null,
    section: 'ingest.bigqueryBeta.section.projects',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, projectIdDenyFieldPath),
};

const datasetAllowFieldPath = 'source.config.dataset_pattern.allow';
export const DATASET_ALLOW: RecipeField = {
    name: 'dataset_pattern.allow',
    label: 'ingest.recipeForms.label.allowPatterns',
    tooltip: 'ingest.bigqueryBeta.bigqueryBetaDatasetsAllowToolTip',
    placeholder: '^my_db$',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: datasetAllowFieldPath,
    rules: null,
    section: 'ingest.bigqueryBeta.section.datasets',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, datasetAllowFieldPath),
};

const datasetDenyFieldPath = 'source.config.dataset_pattern.deny';
export const DATASET_DENY: RecipeField = {
    name: 'dataset_pattern.deny',
    label: 'ingest.recipeForms.label.denyPatterns',
    tooltip: 'ingest.bigqueryBeta.bigqueryBetaDatasetsDenyToolTip',
    placeholder: '^my_db$',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: datasetDenyFieldPath,
    rules: null,
    section: 'ingest.bigqueryBeta.section.datasets',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, datasetDenyFieldPath),
};
