import { RecipeField, FieldType } from './common';

export const TRINO = 'trino';

export const TRINO_HOST_PORT: RecipeField = {
    name: 'host_port',
    label: 'ingest.recipeForms.label.hostAndPort',
    tooltip: 'ingest.recipeForms.trino.trinoHostAndPortToolTip',
    type: FieldType.TEXT,
    fieldPath: 'source.config.host_port',
    placeholder: 'trino-server:5432',
    required: true,
    rules: null,
};

export const TRINO_DATABASE: RecipeField = {
    name: 'database',
    label: 'ingest.recipeForms.label.database',
    tooltip: 'ingest.recipeForms.toolTip.ingestMetadataForASpecificDatabase',
    type: FieldType.TEXT,
    fieldPath: 'source.config.database',
    placeholder: 'my_db',
    required: true,
    rules: null,
};

export const TRINO_USERNAME: RecipeField = {
    name: 'username',
    label: 'ingest.recipeForms.label.username',
    tooltip: 'ingest.recipeForms.trino.trinoUsernameToolTip',
    type: FieldType.TEXT,
    fieldPath: 'source.config.username',
    placeholder: 'trino',
    required: true,
    rules: null,
};

export const TRINO_PASSWORD: RecipeField = {
    name: 'password',
    label: 'ingest.recipeForms.label.password',
    tooltip: 'ingest.recipeForms.trino.trinoPasswordToolTip',
    type: FieldType.SECRET,
    fieldPath: 'source.config.password',
    placeholder: 'password',
    required: true,
    rules: null,
};
