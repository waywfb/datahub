import { RecipeField, FieldType } from './common';

export const MYSQL_HOST_PORT: RecipeField = {
    name: 'host_port',
    label: 'ingest.recipeForms.label.hostAndPort',
    tooltip: 'ingest.mysql.mysqlHostAndPortToolTip',
    type: FieldType.TEXT,
    fieldPath: 'source.config.host_port',
    placeholder: 'mysql:5432',
    required: true,
    rules: null,
};

export const MYSQL_USERNAME: RecipeField = {
    name: 'username',
    label: 'ingest.recipeForms.label.username',
    tooltip: 'ingest.mysql.mysqlUsernameToolTip',
    type: FieldType.TEXT,
    fieldPath: 'source.config.username',
    placeholder: 'mysql',
    required: true,
    rules: null,
};

export const MYSQL_PASSWORD: RecipeField = {
    name: 'password',
    label: 'ingest.recipeForms.label.password',
    tooltip: 'ingest.mysql.mysqlPasswordToolTip',
    type: FieldType.SECRET,
    fieldPath: 'source.config.password',
    placeholder: 'password',
    required: true,
    rules: null,
};
