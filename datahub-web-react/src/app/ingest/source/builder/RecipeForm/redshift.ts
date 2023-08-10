import { RecipeField, FieldType } from './common';

export const REDSHIFT_HOST_PORT: RecipeField = {
    name: 'host_port',
    label: 'ingest.recipeForms.label.hostAndPort',
    tooltip: 'ingest.recipeForms.redshift.redshiftHostAndPortToolTip',
    type: FieldType.TEXT,
    fieldPath: 'source.config.host_port',
    placeholder: 'redshift.company.us-west-1.redshift.amazonaws.com:5439',
    rules: null,
    required: true,
};

export const REDSHIFT_DATABASE: RecipeField = {
    name: 'database',
    label: 'ingest.recipeForms.label.database',
    tooltip: 'ingest.recipeForms.toolTip.ingestMetadataForASpecificDatabase',
    type: FieldType.TEXT,
    fieldPath: 'source.config.database',
    placeholder: 'database_name',
    rules: null,
    required: true,
};

export const REDSHIFT_USERNAME: RecipeField = {
    name: 'redshift.username',
    label: 'ingest.recipeForms.label.username',
    tooltip: 'ingest.recipeForms.redshift.redshiftUsernameToolTip',
    type: FieldType.TEXT,
    fieldPath: 'source.config.username',
    placeholder: 'redshift',
    rules: null,
    required: true,
};

export const REDSHIFT_PASSWORD: RecipeField = {
    name: 'redshift.password',
    label: 'ingest.recipeForms.label.password',
    tooltip: 'ingest.recipeForms.redshift.redshiftPasswordToolTip',
    type: FieldType.SECRET,
    fieldPath: 'source.config.password',
    placeholder: 'password',
    rules: null,
    required: true,
};
