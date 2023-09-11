import { RecipeField, FieldType, setListValuesOnRecipe } from './common';

export const TABLEAU_CONNECTION_URI: RecipeField = {
    name: 'connect_uri',
    label: 'ingest.recipeForms.tableau.label.hostURL',
    tooltip: 'ingest.recipeForms.tableau.tableauHostUrlToolTip',
    type: FieldType.TEXT,
    fieldPath: 'source.config.connect_uri',
    placeholder: 'https://prod-ca-a.online.tableau.com',
    required: true,
    rules: null,
};

const tableauProjectFieldPath = 'source.config.projects';
export const TABLEAU_PROJECT: RecipeField = {
    name: 'projects',
    label: 'ingest.recipeForms.tableau.label.projects',
    tooltip: 'ingest.recipeForms.tableau.tableauProjectToolTip',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.tableau.buttonLabel.addProject',
    fieldPath: tableauProjectFieldPath,
    rules: null,
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, tableauProjectFieldPath),
};

export const TABLEAU_SITE: RecipeField = {
    name: 'site',
    label: 'ingest.recipeForms.tableau.label.tableauSite',
    tooltip: 'ingest.recipeForms.tableau.tableauSiteToolTip',
    type: FieldType.TEXT,
    fieldPath: 'source.config.site',
    placeholder: 'datahub',
    rules: null,
};

export const TABLEAU_TOKEN_NAME: RecipeField = {
    name: 'tableau.token_name',
    label: 'ingest.recipeForms.tableau.label.tokenName',
    tooltip: 'ingest.recipeForms.tableau.tokenNameToolTip',
    type: FieldType.TEXT,
    fieldPath: 'source.config.token_name',
    placeholder: 'access_token_name',
    rules: null,
};

export const TABLEAU_TOKEN_VALUE: RecipeField = {
    name: 'tableau.token_value',
    label: 'ingest.recipeForms.tableau.label.tokenValue',
    tooltip: 'ingest.recipeForms.tableau.tableauTokenValueToolTip',
    type: FieldType.SECRET,
    fieldPath: 'source.config.token_value',
    placeholder: 'access_token_value',
    rules: null,
};

export const TABLEAU_USERNAME: RecipeField = {
    name: 'tableau.username',
    label: 'ingest.recipeForms.label.username',
    tooltip: 'ingest.recipeForms.tableau.tableauUsernameToolTip',
    type: FieldType.TEXT,
    fieldPath: 'source.config.username',
    placeholder: 'tableau',
    rules: null,
};

export const TABLEAU_PASSWORD: RecipeField = {
    name: 'tableau.password',
    label: 'ingest.recipeForms.label.password',
    tooltip: 'ingest.recipeForms.tableau.tableauPasswordToolTip',
    type: FieldType.SECRET,
    fieldPath: 'source.config.password',
    placeholder: 'password',
    rules: null,
};
