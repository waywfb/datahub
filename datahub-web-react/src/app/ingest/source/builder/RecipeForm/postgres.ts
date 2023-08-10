import { RecipeField, FieldType } from './common';

export const POSTGRES_HOST_PORT: RecipeField = {
    name: 'host_port',
    label: 'ingest.recipeForms.label.hostAndPort',
    tooltip: 'ingest.postgres.postgresHostAndPortToolTip',
    type: FieldType.TEXT,
    fieldPath: 'source.config.host_port',
    placeholder: 'postgres:5432',
    required: true,
    rules: null,
};

export const POSTGRES_DATABASE: RecipeField = {
    name: 'database',
    label: 'ingest.recipeForms.label.database',
    tooltip: 'ingest.recipeForms.toolTip.ingestMetadataForASpecificDatabase',
    type: FieldType.TEXT,
    fieldPath: 'source.config.database',
    placeholder: 'my_db',
    required: true,
    rules: null,
};

export const POSTGRES_USERNAME: RecipeField = {
    name: 'username',
    label: 'ingest.recipeForms.label.username',
    tooltip: 'ingest.postgres.postgresUsernameToolTip',
    type: FieldType.TEXT,
    fieldPath: 'source.config.username',
    placeholder: 'postgres',
    required: true,
    rules: null,
};

export const POSTGRES_PASSWORD: RecipeField = {
    name: 'password',
    label: 'ingest.recipeForms.label.password',
    tooltip: 'ingest.postgres.postgresPasswordToolTip',
    type: FieldType.SECRET,
    fieldPath: 'source.config.password',
    placeholder: 'password',
    required: true,
    rules: null,
};
