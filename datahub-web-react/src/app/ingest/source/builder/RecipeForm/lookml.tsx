import React from 'react';
import { get } from 'lodash';
import { Trans } from 'react-i18next';
import { FieldType, RecipeField, setFieldValueOnRecipe } from './common';

export const LOOKML = 'lookml';

export const LOOKML_GITHUB_INFO_REPO: RecipeField = {
    name: 'github_info.repo',
    label: 'ingest.recipeForms.label.githubRepo',
    tooltip: 'ingest.lookml.lookmlGithubRepoToolTip',
    type: FieldType.TEXT,
    fieldPath: 'source.config.github_info.repo',
    placeholder: 'datahub-project/datahub',
    rules: [{ required: true, message: 'Github Repo is required' }],
    required: true,
};

const deployKeyFieldPath = 'source.config.github_info.deploy_key';
export const DEPLOY_KEY: RecipeField = {
    name: 'github_info.deploy_key',
    label: 'ingest.lookml.label.githubDeployKey',
    tooltip: (
        <>
            <Trans
                {...{
                    i18nKey: 'ingest.lookml.lookmlGithubDeployKeyToolTipOne',
                }}
            />
            <div style={{ marginTop: 8 }}>
                <Trans
                    {...{
                        i18nKey: 'ingest.lookml.lookmlGithubDeployKeyToolTipTwo',
                        components: {
                            aLink: (
                                // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
                                <a
                                    href="https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                />
                            ),
                        },
                    }}
                />
            </div>
        </>
    ),
    type: FieldType.TEXTAREA,
    fieldPath: 'source.config.github_info.deploy_key',
    placeholder: '-----BEGIN OPENSSH PRIVATE KEY-----\n...',
    rules: [{ required: true, message: 'Github Deploy Key is required' }],
    setValueOnRecipeOverride: (recipe: any, value: string) => {
        const valueWithNewLine = `${value}\n`;
        return setFieldValueOnRecipe(recipe, valueWithNewLine, deployKeyFieldPath);
    },
    required: true,
};

function validateApiSection(getFieldValue, fieldName) {
    return {
        validator(_, value) {
            if (
                !!value ||
                (getFieldValue('connection_to_platform_map') &&
                    getFieldValue('connection_to_platform_map').length &&
                    getFieldValue('project_name'))
            ) {
                return Promise.resolve();
            }
            return Promise.reject(
                new Error(`${fieldName} is required if Connection to Platform Map and Project Name are not filled out`),
            );
        },
    };
}

export const LOOKML_BASE_URL: RecipeField = {
    name: 'base_url',
    label: 'ingest.lookml.label.lookerBaseUrl',
    tooltip: 'ingest.lookml.lookmlLookerBaseUrlToolTip',
    type: FieldType.TEXT,
    fieldPath: 'source.config.api.base_url',
    placeholder: 'https://looker.company.com',
    rules: [({ getFieldValue }) => validateApiSection(getFieldValue, 'Base URL')],
};

export const LOOKML_CLIENT_ID: RecipeField = {
    name: 'client_id',
    label: 'ingest.lookml.label.lookerClientID',
    tooltip: 'ingest.lookml.lookmlLookerClientID',
    type: FieldType.SECRET,
    placeholder: 'client_id',
    fieldPath: 'source.config.api.client_id',
    rules: [({ getFieldValue }) => validateApiSection(getFieldValue, 'Client ID')],
};

export const LOOKML_CLIENT_SECRET: RecipeField = {
    name: 'client_secret',
    label: 'ingest.lookml.label.lookerClientSecret',
    tooltip: 'ingest.lookml.lookmlLookerClientSecretToolTip',
    type: FieldType.SECRET,
    fieldPath: 'source.config.api.client_secret',
    placeholder: 'client_secret',
    rules: [({ getFieldValue }) => validateApiSection(getFieldValue, 'Client Secret')],
};

export const PROJECT_NAME: RecipeField = {
    name: 'project_name',
    label: 'ingest.lookml.label.lookmlProjectName',
    tooltip: (
        <>
            <Trans
                {...{
                    i18nKey: 'ingest.lookml.lookmlProjectName',
                    components: {
                        aLink: (
                            // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
                            <a
                                href="https://docs.looker.com/data-modeling/getting-started/how-project-works"
                                target="_blank"
                                rel="noreferrer"
                            />
                        ),
                    },
                }}
            />
        </>
    ),
    type: FieldType.TEXT,
    fieldPath: 'source.config.project_name',
    placeholder: 'My Project',
    rules: [
        ({ getFieldValue }) => ({
            validator(_, value) {
                if (
                    !!value ||
                    (getFieldValue('base_url') && getFieldValue('client_id') && getFieldValue('client_secret'))
                ) {
                    return Promise.resolve();
                }
                return Promise.reject(
                    new Error('Project Name is required if Base URL, Client ID, and Client Secret are not filled out'),
                );
            },
        }),
    ],
};

export const PARSE_TABLE_NAMES_FROM_SQL: RecipeField = {
    name: 'parse_table_names_from_sql',
    label: 'ingest.lookml.label.extractExternalLineage',
    tooltip: 'ingest.lookml.lookmlExtractExternalLineage',
    type: FieldType.BOOLEAN,
    fieldPath: 'source.config.parse_table_names_from_sql',
    rules: null,
};

export const CONNECTION_TO_PLATFORM_MAP_NAME: RecipeField = {
    name: 'name',
    label: 'common.name',
    tooltip: (
        <div>
            <Trans
                {...{
                    i18nKey: 'ingest.lookml.lookmlNameToolTip',
                    components: {
                        aLink: (
                            // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
                            <a
                                href="https://cloud.google.com/looker/docs/reference/param-model-connection"
                                target="_blank"
                                rel="noreferrer"
                            />
                        ),
                    },
                }}
            />
        </div>
    ),

    type: FieldType.TEXT,
    fieldPath: 'name',
    placeholder: 'my_mysql_connection',
    rules: [{ required: true, message: 'Name is required' }],
};

export const PLATFORM: RecipeField = {
    name: 'platform',
    label: 'common.platform',
    tooltip: 'ingest.lookml.lookmlPlatformToolTip',
    type: FieldType.TEXT,
    fieldPath: 'platform',
    placeholder: 'snowflake',
    rules: [{ required: true, message: 'Platform is required' }],
};

export const DEFAULT_DB: RecipeField = {
    name: 'default_db',
    label: 'ingest.lookml.label.defaultDatabase',
    tooltip: 'ingest.lookml.lookmlDefaultDatabaseToolTip',
    type: FieldType.TEXT,
    fieldPath: 'default_db',
    placeholder: 'default_db',
    rules: [{ required: true, message: 'Default Database is required' }],
};

const dictFields = [PLATFORM, DEFAULT_DB];
const connectionToPlatformMapFieldPath = 'source.config.connection_to_platform_map';
export const CONNECTION_TO_PLATFORM_MAP: RecipeField = {
    name: 'connection_to_platform_map',
    label: 'ingest.lookml.label.connectionToPlatformMap',
    tooltip: 'ingest.lookml.lookmlConnectionToPlatformMap',
    type: FieldType.DICT,
    buttonLabel: 'ingest.lookml.buttonLabel.addMapping',
    fieldPath: connectionToPlatformMapFieldPath,
    keyField: CONNECTION_TO_PLATFORM_MAP_NAME,
    fields: dictFields,
    rules: [
        ({ getFieldValue }) => ({
            validator(_, value) {
                if (
                    (!!value && !!value.length) ||
                    (getFieldValue('base_url') && getFieldValue('client_id') && getFieldValue('client_secret'))
                ) {
                    return Promise.resolve();
                }
                return Promise.reject(
                    new Error(
                        'Connection Map is required if Base URL, Client ID, and Client Secret are not filled out',
                    ),
                );
            },
        }),
    ],
    getValueFromRecipeOverride: (recipe: any) => {
        const value = get(recipe, connectionToPlatformMapFieldPath);
        if (!value) return undefined;
        const keys = Object.keys(value);
        return keys.map((key) => ({
            [CONNECTION_TO_PLATFORM_MAP_NAME.name]: key,
            [PLATFORM.name]: value[key][PLATFORM.name],
            [DEFAULT_DB.name]: value[key][DEFAULT_DB.name],
        }));
    },
    setValueOnRecipeOverride: (recipe: any, values: string[]) => {
        const filteredValues = values.filter((v) => !!v);
        if (!filteredValues.length) return setFieldValueOnRecipe(recipe, null, connectionToPlatformMapFieldPath);

        const result = {};
        filteredValues.forEach((value) => {
            result[value[CONNECTION_TO_PLATFORM_MAP_NAME.name]] = {
                [PLATFORM.name]: value[PLATFORM.name],
                [DEFAULT_DB.name]: value[DEFAULT_DB.name],
            };
        });
        return setFieldValueOnRecipe(recipe, result, connectionToPlatformMapFieldPath);
    },
};
