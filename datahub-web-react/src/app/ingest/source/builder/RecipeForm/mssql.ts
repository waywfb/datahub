import { RecipeField, FieldType } from './common';

export const MSSQL = 'mssql';

export const MSSQL_HOST_PORT: RecipeField = {
    name: 'host_port',
    label: 'ingest.recipeForms.label.hostAndPort',
    tooltip: 'ingest.mssql.mssqlHostAndPortToolTip',
    type: FieldType.TEXT,
    fieldPath: 'source.config.host_port',
    placeholder: 'mssql-server:5432',
    required: true,
    rules: null,
};

export const MSSQL_DATABASE: RecipeField = {
    name: 'database',
    label: 'ingest.recipeForms.label.database',
    tooltip: 'ingest.recipeForms.toolTip.ingestMetadataForASpecificDatabase',
    type: FieldType.TEXT,
    fieldPath: 'source.config.database',
    placeholder: 'my_db',
    required: true,
    rules: null,
};

export const MSSQL_USERNAME: RecipeField = {
    name: 'username',
    label: 'ingest.recipeForms.label.username',
    tooltip: 'ingest.mssql.mssqlUsernameToolTip',
    type: FieldType.TEXT,
    fieldPath: 'source.config.username',
    placeholder: 'mssql',
    required: true,
    rules: null,
};

export const MSSQL_PASSWORD: RecipeField = {
    name: 'password',
    label: 'ingest.recipeForms.label.password',
    tooltip: 'ingest.mssql.mssqlPasswordToolTip',
    type: FieldType.SECRET,
    fieldPath: 'source.config.password',
    placeholder: 'password',
    required: true,
    rules: null,
};
