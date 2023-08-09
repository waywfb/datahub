import React, { useEffect, useState } from 'react';
import { Alert, Button, message, Space, Typography } from 'antd';
import styled from 'styled-components';
import { Trans, useTranslation } from 'react-i18next';
import { StepProps } from './types';
import { getPlaceholderRecipe, getSourceConfigs, jsonToYaml } from '../utils';
import { YamlEditor } from './YamlEditor';
import { ANTD_GRAY } from '../../../entity/shared/constants';
import { IngestionSourceBuilderStep } from './steps';
import RecipeBuilder from './RecipeBuilder';
import { CONNECTORS_WITH_FORM } from './RecipeForm/constants';
import { getRecipeJson } from './RecipeForm/TestConnection/TestConnectionButton';
import { getSourceConfigsDisplayName } from './utils';

const LOOKML_DOC_LINK = 'https://datahubproject.io/docs/generated/ingestion/sources/looker#module-lookml';

const Section = styled.div`
    display: flex;
    flex-direction: column;
    padding-bottom: 16px;
`;

const BorderedSection = styled(Section)`
    border: solid ${ANTD_GRAY[4]} 0.5px;
`;

const SelectTemplateHeader = styled(Typography.Title)`
    && {
        margin-bottom: 8px;
    }
`;

const ControlsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
`;

/**
 * The step for defining a recipe
 */
export const DefineRecipeStep = ({ state, updateState, goTo, prev, ingestionSources }: StepProps) => {
    const { i18n, t } = useTranslation();
    const existingRecipeJson = state.config?.recipe;
    const existingRecipeYaml = existingRecipeJson && jsonToYaml(existingRecipeJson);
    const { type } = state;
    const sourceConfigs = getSourceConfigs(ingestionSources, type as string);
    const placeholderRecipe = getPlaceholderRecipe(ingestionSources, type);

    const [stagedRecipeYml, setStagedRecipeYml] = useState(existingRecipeYaml || placeholderRecipe);

    useEffect(() => {
        if (existingRecipeYaml) {
            setStagedRecipeYml(existingRecipeYaml);
        }
    }, [existingRecipeYaml]);

    const [stepComplete, setStepComplete] = useState(false);

    const isEditing: boolean = prev === undefined;
    const displayRecipe = stagedRecipeYml || placeholderRecipe;
    const sourceDisplayName = getSourceConfigsDisplayName(sourceConfigs, t, i18n);
    const sourceDocumentationUrl = sourceConfigs?.docsUrl;

    // TODO: Delete LookML banner specific code
    const isSourceLooker: boolean = sourceConfigs?.name === 'looker';
    const [showLookerBanner, setShowLookerBanner] = useState(isSourceLooker && !isEditing);

    useEffect(() => {
        if (stagedRecipeYml && stagedRecipeYml.length > 0 && !showLookerBanner) {
            setStepComplete(true);
        }
    }, [stagedRecipeYml, showLookerBanner]);

    const onClickNext = () => {
        const recipeJson = getRecipeJson(stagedRecipeYml);
        if (!recipeJson) return;

        if (!JSON.parse(recipeJson).source?.type) {
            message.warning({
                content: t('ingest.pleaseAddValidIngestionType'),
                duration: 3,
            });
            return;
        }

        const newState = {
            ...state,
            config: {
                ...state.config,
                recipe: recipeJson,
            },
            type: JSON.parse(recipeJson).source.type,
        };
        updateState(newState);

        goTo(IngestionSourceBuilderStep.CREATE_SCHEDULE);
    };

    if (type && CONNECTORS_WITH_FORM.has(type)) {
        return (
            <RecipeBuilder
                state={state}
                isEditing={isEditing}
                displayRecipe={displayRecipe}
                sourceConfigs={sourceConfigs}
                setStagedRecipe={setStagedRecipeYml}
                onClickNext={onClickNext}
                goToPrevious={prev}
            />
        );
    }

    return (
        <>
            <Section>
                <SelectTemplateHeader level={5}>
                    {t('ingest.configureSourceRecipeWithName', { name: sourceDisplayName })}
                </SelectTemplateHeader>
                {showLookerBanner && (
                    <Alert
                        type="warning"
                        banner
                        message={
                            <>
                                <big>
                                    <i>
                                        <b>{t('ingest.youMustAcknowledgeThisMessageToProceed')}</b>
                                    </i>
                                </big>
                                <br />
                                <br />
                                <Trans
                                    {...{
                                        i18nKey: 'ingest.ToGetCompleteLookerMetadataIntegrationText_component',
                                        components: {
                                            bold: <b />,
                                            aLink: (
                                                // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
                                                <a href={LOOKML_DOC_LINK} target="_blank" rel="noopener noreferrer" />
                                            ),
                                        },
                                    }}
                                />
                                <br />
                                <br />
                                <Trans
                                    {...{
                                        i18nKey: 'ingest.lookMlIngestionCannotText_component',
                                        components: {
                                            bold: <b />,
                                        },
                                    }}
                                />
                                <br />
                                <Space direction="horizontal" style={{ width: '100%', justifyContent: 'center' }}>
                                    <Button type="ghost" size="small" onClick={() => setShowLookerBanner(false)}>
                                        {t('ingest.IHaveSetUpLookMLIngestion')}
                                    </Button>
                                </Space>
                            </>
                        }
                        afterClose={() => setShowLookerBanner(false)}
                    />
                )}
                <Typography.Text>
                    {showLookerBanner && <br />}
                    <Trans
                        {...{
                            i18nKey: 'ingest.forMoreInformationAboutHowToConfigureARecipeText_component',
                            components: {
                                aLink: (
                                    // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
                                    <a href={sourceDocumentationUrl} target="_blank" rel="noopener noreferrer" />
                                ),
                            },
                        }}
                    />
                </Typography.Text>
            </Section>
            <BorderedSection>
                <YamlEditor initialText={displayRecipe} onChange={setStagedRecipeYml} />
            </BorderedSection>
            <ControlsContainer>
                <Button disabled={isEditing} onClick={prev}>
                    {t('common.previous')}
                </Button>
                <Button disabled={!stepComplete} onClick={onClickNext}>
                    {t('common.next')}
                </Button>
            </ControlsContainer>
        </>
    );
};
