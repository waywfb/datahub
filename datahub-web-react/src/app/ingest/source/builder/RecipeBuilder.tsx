import React, { useState } from 'react';
import { Button, message, Typography } from 'antd';
import YAML from 'yamljs';
import { CodeOutlined, FormOutlined } from '@ant-design/icons';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { ANTD_GRAY } from '../../../entity/shared/constants';
import { YamlEditor } from './YamlEditor';
import RecipeForm from './RecipeForm/RecipeForm';
import { SourceBuilderState, SourceConfig } from './types';
import { LOOKER, LOOK_ML } from './constants';
import { LookerWarning } from './LookerWarning';
import { getSourceConfigsDisplayName } from './utils';

export const ControlsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
`;

const BorderedSection = styled.div`
    display: flex;
    flex-direction: column;
    padding-bottom: 16px;
    border: solid ${ANTD_GRAY[4]} 0.5px;
`;

const StyledButton = styled(Button)<{ isSelected: boolean }>`
    ${(props) =>
        props.isSelected &&
        `
        color: #1890ff;
        &:focus {
            color: #1890ff;
        }    
    `}
`;

const Title = styled(Typography.Title)`
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;

const ButtonsWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
`;

interface Props {
    state: SourceBuilderState;
    isEditing: boolean;
    displayRecipe: string;
    sourceConfigs?: SourceConfig;
    setStagedRecipe: (recipe: string) => void;
    onClickNext: () => void;
    goToPrevious?: () => void;
}

function RecipeBuilder(props: Props) {
    const { t } = useTranslation();
    const { state, isEditing, displayRecipe, sourceConfigs, setStagedRecipe, onClickNext, goToPrevious } = props;
    const { type } = state;
    const [isViewingForm, setIsViewingForm] = useState(true);

    function switchViews(isFormView: boolean) {
        try {
            YAML.parse(displayRecipe);
            setIsViewingForm(isFormView);
        } catch (e) {
            const messageText = (e as any).parsedLine
                ? t('ingest.fixLineInYourRecipeWithParsedLine', { parsedLine: (e as any).parsedLine })
                : t('ingest.pleaseFixYourRecipe');
            message.warn(t('ingest.foundInvalidYAMLWithMessage', { msg: messageText }));
        }
    }

    return (
        <div>
            {(type === LOOKER || type === LOOK_ML) && <LookerWarning type={type} />}
            <HeaderContainer>
                <Title style={{ marginBottom: 0 }} level={5}>
                    {getSourceConfigsDisplayName(sourceConfigs, t)} {t('common.recipe')}
                </Title>
                <ButtonsWrapper>
                    <StyledButton type="text" isSelected={isViewingForm} onClick={() => switchViews(true)}>
                        <FormOutlined /> {t('common.form')}
                    </StyledButton>
                    <StyledButton type="text" isSelected={!isViewingForm} onClick={() => switchViews(false)}>
                        <CodeOutlined /> {t('common.yaml')}
                    </StyledButton>
                </ButtonsWrapper>
            </HeaderContainer>
            {isViewingForm && (
                <RecipeForm
                    state={state}
                    isEditing={isEditing}
                    displayRecipe={displayRecipe}
                    sourceConfigs={sourceConfigs}
                    setStagedRecipe={setStagedRecipe}
                    onClickNext={onClickNext}
                    goToPrevious={goToPrevious}
                />
            )}
            {!isViewingForm && (
                <>
                    <BorderedSection>
                        <YamlEditor initialText={displayRecipe} onChange={setStagedRecipe} />
                    </BorderedSection>
                    <ControlsContainer>
                        <Button disabled={isEditing} onClick={goToPrevious}>
                            {t('common.previous')}
                        </Button>
                        <Button onClick={onClickNext}>{t('common.next')}</Button>
                    </ControlsContainer>
                </>
            )}
        </div>
    );
}

export default RecipeBuilder;
