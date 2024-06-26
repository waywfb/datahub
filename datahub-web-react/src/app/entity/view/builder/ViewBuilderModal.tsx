import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Modal, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { DEFAULT_BUILDER_STATE, ViewBuilderState } from '../types';
import { ViewBuilderForm } from './ViewBuilderForm';
import ClickOutside from '../../../shared/ClickOutside';
import { ViewBuilderMode } from './types';

const modalWidth = 700;
const modalStyle = { top: 40 };
const modalBodyStyle = { paddingRight: 60, paddingLeft: 60, paddingBottom: 40 };

const TitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const SaveButtonContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: right;
`;

const CancelButton = styled(Button)`
    margin-right: 12px;
`;

type Props = {
    mode: ViewBuilderMode;
    urn?: string;
    initialState?: ViewBuilderState;
    onSubmit: (input: ViewBuilderState) => void;
    onCancel?: () => void;
};

const getTitleText = (mode, urn, t: TFunction) => {
    if (mode === ViewBuilderMode.PREVIEW) {
        return t('filter.view.previewView');
    }
    return t(urn !== undefined ? 'crud.editWithName' : 'crud.createWithName', { name: t('common.view') });
};

export const ViewBuilderModal = ({ mode, urn, initialState, onSubmit, onCancel }: Props) => {
    const { t } = useTranslation();
    const [viewBuilderState, setViewBuilderState] = useState<ViewBuilderState>(initialState || DEFAULT_BUILDER_STATE);

    useEffect(() => {
        setViewBuilderState(initialState || DEFAULT_BUILDER_STATE);
    }, [initialState]);

    const confirmClose = () => {
        Modal.confirm({
            title: t('filter.view.exitViewEditor'),
            content: t('filter.view.exitViewEditorConfirm'),
            onOk() {
                onCancel?.();
            },
            onCancel() {},
            okText: t('common.yes'),
            cancelText: t('common.cancel'),
            maskClosable: true,
            closable: true,
        });
    };

    const canSave = viewBuilderState.name && viewBuilderState.viewType && viewBuilderState?.definition?.filter;
    const titleText = getTitleText(mode, urn, t);

    return (
        <ClickOutside onClickOutside={confirmClose} wrapperClassName="test-builder-modal">
            <Modal
                wrapClassName="view-builder-modal"
                footer={null}
                title={
                    <TitleContainer>
                        <Typography.Text>{titleText}</Typography.Text>
                    </TitleContainer>
                }
                style={modalStyle}
                bodyStyle={modalBodyStyle}
                visible
                width={modalWidth}
                onCancel={onCancel}
                data-testid="view-modal"
            >
                <ViewBuilderForm urn={urn} mode={mode} state={viewBuilderState} updateState={setViewBuilderState} />
                <SaveButtonContainer>
                    <CancelButton data-testid="view-builder-cancel" onClick={onCancel}>
                        {t('common.cancel')}
                    </CancelButton>
                    {mode === ViewBuilderMode.EDITOR && (
                        <Button
                            data-testid="view-builder-save"
                            type="primary"
                            disabled={!canSave}
                            onClick={() => onSubmit(viewBuilderState)}
                        >
                            {t('common.save')}
                        </Button>
                    )}
                </SaveButtonContainer>
            </Modal>
        </ClickOutside>
    );
};
