import { RecipeField, FieldType } from './common';

export const HIVE_HOST_PORT: RecipeField = {
    name: 'host_port',
    label: 'ingest.recipeForms.label.hostAndPort',
    tooltip: 'ingest.hive.hiveHostPortToolTip',
    type: FieldType.TEXT,
    fieldPath: 'source.config.host_port',
    placeholder: 'hive:9083',
    required: true,
    rules: null,
};

export const HIVE_DATABASE: RecipeField = {
    name: 'database',
    label: 'ingest.recipeForms.label.database',
    tooltip: 'ingest.hive.hiveDatabaseToolTip',
    type: FieldType.TEXT,
    fieldPath: 'source.config.database',
    placeholder: 'my_db',
    rules: null,
};

export const HIVE_USERNAME: RecipeField = {
    name: 'username',
    label: 'ingest.recipeForms.label.username',
    tooltip: 'ingest.hive.hiveUsernameToolTip',
    type: FieldType.TEXT,
    fieldPath: 'source.config.username',
    placeholder: 'hive',
    required: true,
    rules: null,
};

export const HIVE_PASSWORD: RecipeField = {
    name: 'password',
    label: 'ingest.recipeForms.label.password',
    tooltip: 'ingest.hive.hivePasswordToolTip',
    type: FieldType.SECRET,
    fieldPath: 'source.config.password',
    placeholder: 'password',
    required: true,
    rules: null,
};
