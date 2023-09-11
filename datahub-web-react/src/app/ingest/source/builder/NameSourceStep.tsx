import { Button, Checkbox, Collapse, Form, Input, Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { SourceBuilderState, StepProps } from './types';

const ControlsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
`;

const SaveButton = styled(Button)`
    margin-right: 15px;
`;

export const NameSourceStep = ({ state, updateState, prev, submit }: StepProps) => {
    const { t } = useTranslation();
    const setName = (stagedName: string) => {
        const newState: SourceBuilderState = {
            ...state,
            name: stagedName,
        };
        updateState(newState);
    };

    const setExecutorId = (execId: string) => {
        const newState: SourceBuilderState = {
            ...state,
            config: {
                ...state.config,
                executorId: execId,
            },
        };
        updateState(newState);
    };

    const setVersion = (version: string) => {
        const newState: SourceBuilderState = {
            ...state,
            config: {
                ...state.config,
                version,
            },
        };
        updateState(newState);
    };

    const setDebugMode = (debugMode: boolean) => {
        const newState: SourceBuilderState = {
            ...state,
            config: {
                ...state.config,
                debugMode,
            },
        };
        updateState(newState);
    };

    const onClickCreate = (shouldRun?: boolean) => {
        if (state.name !== undefined && state.name.length > 0) {
            submit(shouldRun);
        }
    };

    return (
        <>
            <Form layout="vertical">
                <Form.Item
                    required
                    label={
                        <Typography.Text strong style={{ marginBottom: 0 }}>
                            {t('common.name')}
                        </Typography.Text>
                    }
                    style={{ marginBottom: 8 }}
                >
                    <Typography.Paragraph>{t('ingest.giveThisIngestionSourceAName')}</Typography.Paragraph>
                    <Input
                        data-testid="source-name-input"
                        className="source-name-input"
                        placeholder="My Redshift Source #2"
                        value={state.name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </Form.Item>
                <Collapse ghost>
                    <Collapse.Panel
                        header={<Typography.Text type="secondary">{t('common.advanced')}</Typography.Text>}
                        key="1"
                    >
                        <Form.Item label={<Typography.Text strong>{t('ingest.executorId')}</Typography.Text>}>
                            <Typography.Paragraph>
                                {t('ingest.provideTheExecutorIDToRouteRequestToText')}
                            </Typography.Paragraph>
                            <Input
                                placeholder="default"
                                value={state.config?.executorId || ''}
                                onChange={(event) => setExecutorId(event.target.value)}
                            />
                        </Form.Item>
                        <Form.Item label={<Typography.Text strong>{t('ingest.cliVersion')}</Typography.Text>}>
                            <Typography.Paragraph>
                                {t('ingest.advancedProvideCustomCLIVersionToUseForIngestion')}
                            </Typography.Paragraph>
                            <Input
                                data-testid="cli-version-input"
                                className="cli-version-input"
                                placeholder="(e.g. 0.10.5)"
                                value={state.config?.version || ''}
                                onChange={(event) => setVersion(event.target.value)}
                            />
                        </Form.Item>
                        <Form.Item label={<Typography.Text strong>{t('common.debugMode')}</Typography.Text>}>
                            <Typography.Paragraph>{t('ingest.advancedTurnOnDebugMode')}</Typography.Paragraph>
                            <Checkbox
                                checked={state.config?.debugMode || false}
                                onChange={(event) => setDebugMode(event.target.checked)}
                            />
                        </Form.Item>
                    </Collapse.Panel>
                </Collapse>
            </Form>
            <ControlsContainer>
                <Button onClick={prev}>{t('common.previous')}</Button>
                <div>
                    <SaveButton
                        disabled={!(state.name !== undefined && state.name.length > 0)}
                        onClick={() => onClickCreate(false)}
                    >
                        {t('common.save')}
                    </SaveButton>
                    <Button
                        disabled={!(state.name !== undefined && state.name.length > 0)}
                        onClick={() => onClickCreate(true)}
                        type="primary"
                    >
                        {t('common.save')} & {t('common.run')}
                    </Button>
                </div>
            </ControlsContainer>
        </>
    );
};
