import React from 'react';
import { Trans } from 'react-i18next';
import { RecipeField, FieldType, setListValuesOnRecipe } from './common';

export const UNITY_CATALOG = 'unity-catalog';

export const TOKEN: RecipeField = {
    name: 'token',
    label: 'common.token',
    tooltip: 'ingest.recipeForms.unityCatalog.tokenToolTip',
    type: FieldType.SECRET,
    fieldPath: 'source.config.token',
    placeholder: 'dapi1a2b3c45d67890e1f234567a8bc9012d',
    required: true,
    rules: null,
};

export const WORKSPACE_URL: RecipeField = {
    name: 'workspace_url',
    label: 'ingest.recipeForms.unityCatalog.workspaceURLLabel',
    tooltip: 'ingest.recipeForms.unityCatalog.workspaceURLTooltip',
    type: FieldType.TEXT,
    fieldPath: 'source.config.workspace_url',
    placeholder: 'https://abcsales.cloud.databricks.com',
    required: true,
    rules: null,
};

export const INCLUDE_TABLE_LINEAGE: RecipeField = {
    name: 'include_table_lineage',
    label: 'ingest.recipeForms.unityCatalog.includeTableLineageLabel',
    tooltip: (
        <div>
            <Trans
                {...{
                    i18nKey: 'ingest.recipeForms.unityCatalog.includeTableLineageToolTip_component',
                    components: {
                        aLink: (
                            // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
                            <a href="https://docs.databricks.com/data-governance/unity-catalog/data-lineage.html#requirements" />
                        ),
                    },
                }}
            />
        </div>
    ),
    type: FieldType.BOOLEAN,
    fieldPath: 'source.config.include_table_lineage',
    rules: null,
};

export const INCLUDE_COLUMN_LINEAGE: RecipeField = {
    name: 'include_column_lineage',
    label: 'ingest.recipeForms.unityCatalog.includeColumnLineageLabel',
    tooltip: (
        <div>
            <Trans
                {...{
                    i18nKey: 'ingest.recipeForms.unityCatalog.includeColumnLineageToolTip_component',
                    components: {
                        aLink: (
                            // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
                            <a href="https://docs.databricks.com/data-governance/unity-catalog/data-lineage.html#requirements" />
                        ),
                    },
                }}
            />
        </div>
    ),
    type: FieldType.BOOLEAN,
    fieldPath: 'source.config.include_column_lineage',
    rules: null,
};

const metastoreIdAllowFieldPath = 'source.config.metastore_id_pattern.allow';
export const UNITY_METASTORE_ID_ALLOW: RecipeField = {
    name: 'metastore_id_pattern.allow',
    label: 'ingest.recipeForms.label.allowPatterns',
    tooltip: 'ingest.recipeForms.unityCatalog.unityMetaStoreIDAllowToolTip',
    placeholder: '11111-2222-33333-44-555555',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: metastoreIdAllowFieldPath,
    rules: null,
    section: 'ingest.recipeForms.unityCatalog.section.metastores',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, metastoreIdAllowFieldPath),
};

const metastoreIdDenyFieldPath = 'source.config.metastore_id_pattern.deny';
export const UNITY_METASTORE_ID_DENY: RecipeField = {
    name: 'metastore_id_pattern.deny',
    label: 'ingest.recipeForms.label.denyPatterns',
    tooltip: 'ingest.recipeForms.unityCatalog.unityMetaStoreIDDenyToolTip',
    placeholder: '11111-2222-33333-44-555555',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: metastoreIdDenyFieldPath,
    rules: null,
    section: 'ingest.recipeForms.unityCatalog.section.metastores',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, metastoreIdDenyFieldPath),
};

const catalogAllowFieldPath = 'source.config.catalog_pattern.allow';
export const UNITY_CATALOG_ALLOW: RecipeField = {
    name: 'catalog_pattern.allow',
    label: 'ingest.recipeForms.label.allowPatterns',
    tooltip: 'ingest.recipeForms.unityCatalog.unityCatalogAllowToolTip',
    placeholder: 'metastore.my_catalog',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: catalogAllowFieldPath,
    rules: null,
    section: 'ingest.recipeForms.unityCatalog.section.catalogs',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, catalogAllowFieldPath),
};

const catalogDenyFieldPath = 'source.config.catalog_pattern.deny';
export const UNITY_CATALOG_DENY: RecipeField = {
    name: 'catalog_pattern.deny',
    label: 'ingest.recipeForms.label.denyPatterns',
    tooltip: 'ingest.recipeForms.unityCatalog.unityCatalogDenyToolTip',
    placeholder: 'metastore.my_catalog',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: catalogDenyFieldPath,
    rules: null,
    section: 'ingest.recipeForms.unityCatalog.section.catalogs',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, catalogDenyFieldPath),
};

const tableAllowFieldPath = 'source.config.table_pattern.allow';
export const UNITY_TABLE_ALLOW: RecipeField = {
    name: 'table_pattern.allow',
    label: 'ingest.recipeForms.label.allowPatterns',
    tooltip: 'ingest.recipeForms.unityCatalog.unityTableAllowToolTip',
    placeholder: 'catalog.schema.table',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: tableAllowFieldPath,
    rules: null,
    section: 'ingest.recipeForms.section.tables',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, tableAllowFieldPath),
};

const tableDenyFieldPath = 'source.config.table_pattern.deny';
export const UNITY_TABLE_DENY: RecipeField = {
    name: 'table_pattern.deny',
    label: 'ingest.recipeForms.label.denyPatterns',
    tooltip: 'ingest.recipeForms.unityCatalog.unityTableDenyToolTip',
    placeholder: 'catalog.schema.table',
    type: FieldType.LIST,
    buttonLabel: 'ingest.recipeForms.buttonLabel.addPatterns',
    fieldPath: tableDenyFieldPath,
    rules: null,
    section: 'ingest.recipeForms.section.tables',
    setValueOnRecipeOverride: (recipe: any, values: string[]) =>
        setListValuesOnRecipe(recipe, values, tableDenyFieldPath),
};
