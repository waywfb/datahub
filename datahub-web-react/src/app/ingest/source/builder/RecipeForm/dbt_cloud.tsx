import React from 'react';
import styled from 'styled-components';
import { get } from 'lodash';
import { Trans } from 'react-i18next';
import { RecipeField, FieldType, setFieldValueOnRecipe } from './common';

const TipSection = styled.div`
    margin-bottom: 12px;
`;

export const DBT_CLOUD = 'dbt-cloud';

export const DBT_CLOUD_TOKEN: RecipeField = {
    name: 'token',
    label: 'ingest.dbtCloud.label.apiToken',
    tooltip: (
        <span>
            <TipSection>
                <Trans
                    {...{
                        i18nKey: 'ingest.dbtCloud.dbtCloudApiTokenToolTipOne',
                        components: {
                            bold: <strong />,
                        },
                    }}
                />
            </TipSection>
            <TipSection>
                <Trans
                    {...{
                        i18nKey: 'ingest.dbtCloud.dbtCloudApiTokenToolTipTwo',
                        components: {
                            aLink: (
                                // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
                                <a href="missions-for-service-account-tokens" />
                            ),
                        },
                    }}
                />
            </TipSection>
        </span>
    ),
    type: FieldType.SECRET,
    fieldPath: 'source.config.token',
    placeholder: 'dbts_ndg_m5oCuSRRC80tpx4ysYfN2tOreiHuATAu5VFcdrkIznQgl4VCOs6w==',
    required: true,
    rules: null,
};

export const DBT_CLOUD_ACCOUNT_ID: RecipeField = {
    name: 'account_id',
    label: 'ingest.recipeForms.label.accountID',
    tooltip: (
        <span>
            <TipSection>
                <Trans
                    {...{
                        i18nKey: 'ingest.dbtCloud.dbtCloudAccountIDToolTipOne',
                    }}
                />
            </TipSection>
            <TipSection>
                <Trans
                    {...{
                        i18nKey: 'ingest.dbtCloud.dbtCloudAccountIDToolTipTwo',
                    }}
                />
            </TipSection>
        </span>
    ),
    type: FieldType.TEXT,
    fieldPath: 'source.config.account_id',
    placeholder: '123',
    required: true,
    rules: null,
};

export const DBT_CLOUD_PROJECT_ID: RecipeField = {
    name: 'project_id',
    label: 'ingest.recipeForms.label.projectID',
    tooltip: (
        <span>
            <TipSection>
                <Trans
                    {...{
                        i18nKey: 'ingest.dbtCloud.dbtCloudProjectIDToolTipOne',
                    }}
                />
            </TipSection>
            <TipSection>
                <Trans
                    {...{
                        i18nKey: 'ingest.dbtCloud.dbtCloudProjectIDToolTipTwo',
                    }}
                />
            </TipSection>
        </span>
    ),
    type: FieldType.TEXT,
    fieldPath: 'source.config.project_id',
    placeholder: '456',
    required: true,
    rules: null,
};

export const DBT_CLOUD_JOB_ID: RecipeField = {
    name: 'job_id',
    label: 'ingest.dbtCloud.label.jobID',
    tooltip: (
        <span>
            <TipSection>
                <Trans
                    {...{
                        i18nKey: 'ingest.dbtCloud.dbtCloudJobIDToolTipOne',
                    }}
                />
            </TipSection>
            <TipSection>
                <Trans
                    {...{
                        i18nKey: 'ingest.dbtCloud.dbtCloudJobIDToolTipTwo',
                    }}
                />
            </TipSection>
            <TipSection>
                <Trans
                    {...{
                        i18nKey: 'ingest.dbtCloud.dbtCloudJobIDToolTipThree',
                    }}
                />
            </TipSection>
        </span>
    ),
    type: FieldType.TEXT,
    fieldPath: 'source.config.job_id',
    placeholder: '789',
    required: true,
    rules: null,
};

const includeModelsPath = 'source.config.entities_enabled.models';
export const INCLUDE_MODELS: RecipeField = {
    name: 'entities_enabled.models',
    label: 'ingest.dbtCloud.label.includeModels',
    tooltip: 'ingest.dbtCloud.dbtCloudIncludeModelsToolTip',
    type: FieldType.BOOLEAN,
    fieldPath: includeModelsPath,
    required: false,
    rules: null,
    getValueFromRecipeOverride: (recipe: any) => {
        const includeModels = get(recipe, includeModelsPath);
        if (!includeModels || includeModels === 'YES') {
            return true;
        }
        return false;
    },
    setValueOnRecipeOverride: (recipe: any, value: boolean) => {
        const includeModels = value === true ? 'YES' : 'NO';
        return setFieldValueOnRecipe(recipe, includeModels, includeModelsPath);
    },
};

const includeSourcesPath = 'source.config.entities_enabled.sources';
export const INCLUDE_SOURCES: RecipeField = {
    name: 'entities_enabled.sources',
    label: 'ingest.dbtCloud.label.includeSources',
    tooltip: 'ingest.dbtCloud.dbtCloudIncludeSourcesToolTip',
    type: FieldType.BOOLEAN,
    fieldPath: includeSourcesPath,
    required: false,
    rules: null,
    getValueFromRecipeOverride: (recipe: any) => {
        const includeSources = get(recipe, includeSourcesPath);
        if (includeSources === 'YES' || includeSources === undefined || includeSources === null) {
            return true;
        }
        return false;
    },
    setValueOnRecipeOverride: (recipe: any, value: boolean) => {
        const includeSources = value === true ? 'YES' : 'NO';
        return setFieldValueOnRecipe(recipe, includeSources, includeSourcesPath);
    },
};

const includeSeedsPath = 'source.config.entities_enabled.seeds';
export const INCLUDE_SEEDS: RecipeField = {
    name: 'entities_enabled.seeds',
    label: 'ingest.dbtCloud.label.includeSeeds',
    tooltip: 'ingest.dbtCloud.dbtCloudIncludeSeedsToolTip',
    type: FieldType.BOOLEAN,
    fieldPath: includeSeedsPath,
    required: false,
    rules: null,
    getValueFromRecipeOverride: (recipe: any) => {
        const includeSeeds = get(recipe, includeSeedsPath);
        if (includeSeeds === 'YES' || includeSeeds === undefined || includeSeeds === null) {
            return true;
        }
        return false;
    },
    setValueOnRecipeOverride: (recipe: any, value: boolean) => {
        const includeSeeds = value === true ? 'YES' : 'NO';
        return setFieldValueOnRecipe(recipe, includeSeeds, includeSourcesPath);
    },
};

const includeTestDefinitionsPath = 'source.config.entities_enabled.test_definitions';
export const INCLUDE_TEST_DEFINITIONS: RecipeField = {
    name: 'entities_enabled.test_definitions',
    label: 'ingest.dbtCloud.label.includeTestDefinitions',
    tooltip: 'ingest.dbtCloud.dbtCloudIncludeTestDefinitionsToolTip',
    type: FieldType.BOOLEAN,
    fieldPath: includeTestDefinitionsPath,
    required: false,
    rules: null,
    getValueFromRecipeOverride: (recipe: any) => {
        const includeTestDefinitions = get(recipe, includeTestDefinitionsPath);
        if (
            includeTestDefinitions === 'YES' ||
            includeTestDefinitions === undefined ||
            includeTestDefinitions === null
        ) {
            return true;
        }
        return false;
    },
    setValueOnRecipeOverride: (recipe: any, value: boolean) => {
        const includeTestDefinitions = value === true ? 'YES' : 'NO';
        return setFieldValueOnRecipe(recipe, includeTestDefinitions, includeTestDefinitionsPath);
    },
};

const includeTestResultsPath = 'source.config.entities_enabled.test_results';
export const INCLUDE_TEST_RESULTS: RecipeField = {
    name: 'entities_enabled.test_results',
    label: 'ingest.dbtCloud.label.includeTestResults',
    tooltip: 'ingest.dbtCloud.dbtCloudIncludeTestResultsToolTip',
    type: FieldType.BOOLEAN,
    fieldPath: includeTestResultsPath,
    required: false,
    rules: null,
    getValueFromRecipeOverride: (recipe: any) => {
        const includeTestResults = get(recipe, includeTestResultsPath);
        if (includeTestResults === 'YES' || includeTestResults === undefined || includeTestResults === null) {
            return true;
        }
        return false;
    },
    setValueOnRecipeOverride: (recipe: any, value: boolean) => {
        const includeTestResults = value === true ? 'YES' : 'NO';
        return setFieldValueOnRecipe(recipe, includeTestResults, includeTestResultsPath);
    },
};

const nodeAllowFieldPath = 'source.config.node_name_pattern.allow';
export const NODE_ALLOW: RecipeField = {
    name: 'node_name_pattern.allow',
    label: 'ingest.recipeForms.label.allowPatterns',
    tooltip: 'ingest.dbtCloud.dbtCloudNodeAllowToolTip',
    placeholder: 'model_name',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: nodeAllowFieldPath,
    rules: null,
    section: 'ingest.dbtCloud.section.nodes',
};

const nodeDenyFieldPath = 'source.config.node_name_pattern.deny';
export const NODE_DENY: RecipeField = {
    name: 'node_name_pattern.deny',
    label: 'ingest.recipeForms.label.denyPatterns',
    tooltip: 'ingest.dbtCloud.dbtCloudNodeDenyToolTip',
    placeholder: 'node_name',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: nodeDenyFieldPath,
    rules: null,
    section: 'ingest.dbtCloud.section.nodes',
};

export const METADATA_ENDPOINT: RecipeField = {
    name: 'metadata_endpoint',
    label: 'ingest.dbtCloud.label.customMetadataEndpointUrl',
    tooltip: 'ingest.dbtCloud.dbtCloudCustomMetadataEndpointUrlToolTip',
    placeholder: 'https://metadata.cloud.getdbt.com/graphql',
    type: FieldType.TEXT,
    fieldPath: 'source.config.metadata_endpoint',
    rules: null,
};

const extractOwnersPath = 'source.config.enable_owner_extraction';
export const EXTRACT_OWNERS: RecipeField = {
    name: 'extract_owners',
    label: 'ingest.recipeForms.label.extractOwners',
    tooltip: 'ingest.dbtCloud.dbtCloudExtractOwnersToolTip',
    type: FieldType.BOOLEAN,
    fieldPath: 'source.config.enable_owner_extraction',
    rules: null,
    getValueFromRecipeOverride: (recipe: any) => {
        const extractOwners = get(recipe, extractOwnersPath);
        if (extractOwners !== undefined && extractOwners !== null) {
            return extractOwners;
        }
        return true;
    },
};

export const TARGET_PLATFORM: RecipeField = {
    name: 'target_platform',
    label: 'ingest.dbtCloud.label.dataPlatformConnectionType',
    tooltip: 'ingest.dbtCloud.dbtCloudDataPlatformConnectionTypeToolTip',
    placeholder: 'Select a Data Platform Type...',
    type: FieldType.SELECT,
    options: [
        { label: 'Snowflake', value: 'snowflake' },
        { label: 'BigQuery', value: 'bigquery' },
        { label: 'Redshift', value: 'redshift' },
        { label: 'Postgres', value: 'postgres' },
        { label: 'Trino (Starburst)', value: 'trino' },
        { label: 'Databricks', value: 'databricks' },
    ],
    fieldPath: 'source.config.target_platform',
    required: true,
    rules: null,
};

export const TARGET_PLATFORM_INSTANCE: RecipeField = {
    name: 'target_platform_instance',
    label: 'ingest.dbtCloud.label.dataPlatformInstance',
    tooltip: (
        <span>
            <TipSection>
                <Trans
                    {...{
                        i18nKey: 'ingest.dbtCloud.dbtCloudDataPlatformInstanceToolTipOne',
                    }}
                />
            </TipSection>
            <TipSection>
                <Trans
                    {...{
                        i18nKey: 'ingest.dbtCloud.dbtCloudDataPlatformInstanceToolTipTwo',
                    }}
                />
            </TipSection>
            <TipSection>
                <Trans
                    {...{
                        i18nKey: 'ingest.dbtCloud.dbtCloudDataPlatformInstanceToolTipThree',
                    }}
                />
            </TipSection>
        </span>
    ),
    placeholder: 'redshift_instance_2',
    type: FieldType.TEXT,
    fieldPath: 'source.config.target_platform_instance',
    rules: null,
};
