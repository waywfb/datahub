import { RecipeField, FieldType } from './common';

export const BIGQUERY_PROJECT_ID: RecipeField = {
    name: 'project_id',
    label: 'ingest.recipeForms.label.projectID',
    tooltip: 'ingest.bigquery.bigqueryProjectIDToolTip',
    placeholder: 'my-project-123',
    type: FieldType.TEXT,
    fieldPath: 'source.config.project_id',
    rules: null,
    required: true,
};

export const BIGQUERY_CREDENTIAL_PROJECT_ID: RecipeField = {
    name: 'credential.project_id',
    label: 'ingest.bigquery.label.credentialProjectID',
    tooltip: 'ingest.bigquery.bigqueryCredentialProjectIDToolTip',
    placeholder: 'my-project-123',
    type: FieldType.TEXT,
    fieldPath: 'source.config.credential.project_id',
    rules: null,
};

export const BIGQUERY_PRIVATE_KEY_ID: RecipeField = {
    name: 'credential.private_key_id',
    label: 'ingest.bigquery.label.privateKeyID',
    tooltip: 'ingest.bigquery.bigqueryPrivateKeyIDToolTip',
    type: FieldType.SECRET,
    fieldPath: 'source.config.credential.private_key_id',
    placeholder: 'd0121d0000882411234e11166c6aaa23ed5d74e0',
    rules: null,
    required: true,
};

export const BIGQUERY_PRIVATE_KEY: RecipeField = {
    name: 'credential.private_key',
    label: 'ingest.bigquery.label.privateKey',
    tooltip: 'ingest.bigquery.bigqueryPrivateKeyToolTip',
    placeholder: '-----BEGIN PRIVATE KEY-----....\n-----END PRIVATE KEY-----',
    type: FieldType.SECRET,
    fieldPath: 'source.config.credential.private_key',
    rules: null,
    required: true,
};

export const BIGQUERY_CLIENT_EMAIL: RecipeField = {
    name: 'credential.client_email',
    label: 'ingest.bigquery.label.clientEmail',
    tooltip: 'ingest.bigquery.bigqueryClientEmailToolTip',
    placeholder: 'client_email@gmail.com',
    type: FieldType.TEXT,
    fieldPath: 'source.config.credential.client_email',
    rules: null,
    required: true,
};

export const BIGQUERY_CLIENT_ID: RecipeField = {
    name: 'credential.client_id',
    label: 'ingest.recipeForms.label.clientID',
    tooltip: 'ingest.bigquery.bigqueryClientIDToolTip',
    placeholder: '123456789098765432101',
    type: FieldType.TEXT,
    fieldPath: 'source.config.credential.client_id',
    rules: null,
    required: true,
};
