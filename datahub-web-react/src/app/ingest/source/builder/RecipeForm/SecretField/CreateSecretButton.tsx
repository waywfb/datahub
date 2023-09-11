import React, { useState } from 'react';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { blue } from '@ant-design/colors';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { SecretBuilderModal } from '../../../../secret/SecretBuilderModal';
import { useCreateSecretMutation } from '../../../../../../graphql/ingestion.generated';
import { SecretBuilderState } from '../../../../secret/types';

const CreateButton = styled(Button)`
    align-items: center;
    display: flex;
    justify-content: center;
    margin: 8px 12px 4px 12px;
    width: calc(100% - 24px);

    &:hover {
        color: ${blue[5]};
    }

    .anticon-plus {
        margin-right: 5px;
    }
`;

interface Props {
    initialState?: SecretBuilderState;
    onSubmit?: (state: SecretBuilderState) => void;
    refetchSecrets: () => void;
}

function CreateSecretButton({ initialState, onSubmit, refetchSecrets }: Props) {
    const { t } = useTranslation();
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [createSecretMutation] = useCreateSecretMutation();

    const createSecret = (state: SecretBuilderState, resetBuilderState: () => void) => {
        createSecretMutation({
            variables: {
                input: {
                    name: state.name as string,
                    value: state.value as string,
                    description: state.description as string,
                },
            },
        })
            .then(() => {
                onSubmit?.(state);
                setIsCreateModalVisible(false);
                resetBuilderState();
                message.success({ content: t('ingest.createdSecret') });
                setTimeout(() => refetchSecrets(), 3000);
            })
            .catch((e) => {
                message.destroy();
                message.error({ content: `${t('ingest.failedToCreateSecret')}: \n ${e.message || ''}` });
            });
    };

    return (
        <>
            <CreateButton onClick={() => setIsCreateModalVisible(true)} type="text">
                <PlusOutlined /> {t('ingest.createSecret')}
            </CreateButton>
            {isCreateModalVisible && (
                <SecretBuilderModal
                    initialState={initialState}
                    visible={isCreateModalVisible}
                    onCancel={() => setIsCreateModalVisible(false)}
                    onSubmit={createSecret}
                />
            )}
        </>
    );
}

export default CreateSecretButton;
