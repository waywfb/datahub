import { FieldType, RecipeField } from './common';

export const SNOWFLAKE_ACCOUNT_ID: RecipeField = {
    name: 'account_id',
    label: 'ingest.recipeForms.label.accountID',
    tooltip: 'ingest.recipeForms.snowFlake.snowFlakeAccountIDToolTip',
    type: FieldType.TEXT,
    fieldPath: 'source.config.account_id',
    placeholder: 'xyz123',
    rules: null,
    required: true,
};

export const SNOWFLAKE_WAREHOUSE: RecipeField = {
    name: 'warehouse',
    label: 'ingest.recipeForms.snowFlake.label.warehouse',
    tooltip: 'ingest.recipeForms.snowFlake.snowFlakeWarehouseToolTip',
    type: FieldType.TEXT,
    fieldPath: 'source.config.warehouse',
    placeholder: 'COMPUTE_WH',
    rules: null,
    required: true,
};

export const SNOWFLAKE_USERNAME: RecipeField = {
    name: 'username',
    label: 'ingest.recipeForms.label.username',
    tooltip: 'ingest.recipeForms.snowFlake.snowFlakeUsernameToolTip',
    type: FieldType.TEXT,
    fieldPath: 'source.config.username',
    placeholder: 'snowflake',
    rules: null,
    required: true,
};

export const SNOWFLAKE_PASSWORD: RecipeField = {
    name: 'password',
    label: 'ingest.recipeForms.label.password',
    tooltip: 'ingest.recipeForms.snowFlake.snowFlakePasswordToolTip',
    type: FieldType.SECRET,
    fieldPath: 'source.config.password',
    placeholder: 'password',
    rules: null,
    required: true,
};

export const SNOWFLAKE_ROLE: RecipeField = {
    name: 'role',
    label: 'ingest.recipeForms.snowFlake.label.role',
    tooltip: 'ingest.recipeForms.snowFlake.snowFlakeRoleToolTip',
    type: FieldType.TEXT,
    fieldPath: 'source.config.role',
    placeholder: 'datahub_role',
    rules: null,
    required: true,
};
