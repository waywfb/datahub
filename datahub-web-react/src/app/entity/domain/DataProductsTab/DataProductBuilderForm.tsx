import { Form, Input, Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Editor as MarkdownEditor } from '../../shared/tabs/Documentation/components/editor/Editor';
import { ANTD_GRAY } from '../../shared/constants';
import { DataProductBuilderState } from './types';

const StyledEditor = styled(MarkdownEditor)`
    border: 1px solid ${ANTD_GRAY[4]};
`;

type Props = {
    builderState: DataProductBuilderState;
    updateBuilderState: (newState: DataProductBuilderState) => void;
};

export default function DataProductBuilderForm({ builderState, updateBuilderState }: Props) {
    const { t } = useTranslation();
    function updateName(name: string) {
        updateBuilderState({
            ...builderState,
            name,
        });
    }

    function updateDescription(description: string) {
        updateBuilderState({
            ...builderState,
            description,
        });
    }

    return (
        <Form layout="vertical">
            <Form.Item
                rules={[{ min: 1, max: 500 }]}
                hasFeedback
                label={<Typography.Text strong>{t('common.name')}</Typography.Text>}
                required
            >
                <Input
                    autoFocus
                    value={builderState.name}
                    onChange={(e) => updateName(e.target.value)}
                    placeholder={t('placeholder.revenueDashboards')}
                />
            </Form.Item>
            <Form.Item label={<Typography.Text strong>{t('common.description')}</Typography.Text>}>
                <StyledEditor doNotFocus content={builderState.description} onChange={updateDescription} />
            </Form.Item>
        </Form>
    );
}
