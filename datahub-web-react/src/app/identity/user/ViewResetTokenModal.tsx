import { RedoOutlined } from '@ant-design/icons';
import { Button, message, Modal, Typography } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Trans, useTranslation } from 'react-i18next';
import { PageRoutes } from '../../../conf/Global';
import { useCreateNativeUserResetTokenMutation } from '../../../graphql/user.generated';
import analytics, { EventType } from '../../analytics';

const ModalSection = styled.div`
    display: flex;
    flex-direction: column;
    padding-bottom: 12px;
`;

const ModalSectionHeader = styled(Typography.Text)`
    &&&& {
        padding: 0;
        margin: 0;
        margin-bottom: 4px;
    }
`;

const ModalSectionParagraph = styled(Typography.Paragraph)`
    &&&& {
        padding: 0;
        margin: 0;
    }
`;

const CreateResetTokenButton = styled(Button)`
    display: inline-block;
    width: 20px;
    margin-left: -6px;
`;

type Props = {
    visible: boolean;
    userUrn: string;
    username: string;
    onClose: () => void;
};

export default function ViewResetTokenModal({ visible, userUrn, username, onClose }: Props) {
    const { t } = useTranslation();
    const baseUrl = window.location.origin;
    const [hasGeneratedResetToken, setHasGeneratedResetToken] = useState(false);

    const [createNativeUserResetTokenMutation, { data: createNativeUserResetTokenData }] =
        useCreateNativeUserResetTokenMutation({});

    const createNativeUserResetToken = () => {
        createNativeUserResetTokenMutation({
            variables: {
                input: {
                    userUrn,
                },
            },
        })
            .then(({ errors }) => {
                if (!errors) {
                    analytics.event({
                        type: EventType.CreateResetCredentialsLinkEvent,
                        userUrn,
                    });
                    setHasGeneratedResetToken(true);
                    message.success(t('authentification.resetCredentialSuccess'));
                }
            })
            .catch((e) => {
                message.destroy();
                message.error({
                    content: `${t('authentification.resetCredentialError')}: \n ${e.message || ''}`,
                    duration: 3,
                });
            });
    };

    const resetToken = createNativeUserResetTokenData?.createNativeUserResetToken?.resetToken || '';

    const inviteLink = `${baseUrl}${PageRoutes.RESET_CREDENTIALS}?reset_token=${resetToken}`;

    return (
        <Modal
            width={700}
            footer={null}
            title={
                <Typography.Text>
                    <b>{t('authentification.resetUserPassword')}</b>
                </Typography.Text>
            }
            visible={visible}
            onCancel={onClose}
        >
            {hasGeneratedResetToken ? (
                <ModalSection>
                    <ModalSectionHeader strong>{t('authentification.shareResetLink')}</ModalSectionHeader>
                    <ModalSectionParagraph>
                        <Trans
                            {...{
                                i18nKey: 'search.seeAllResultsWithName_component',
                                values: { username },
                                components: { bold: <b /> },
                            }}
                        />
                    </ModalSectionParagraph>
                    <Typography.Paragraph copyable={{ text: inviteLink }}>
                        <pre>{inviteLink}</pre>
                    </Typography.Paragraph>
                </ModalSection>
            ) : (
                <ModalSection>
                    <ModalSectionHeader strong>{t('authentification.newLinkMustBeGenerated')}</ModalSectionHeader>
                    <ModalSectionParagraph>
                        {t('authentification.newLinkMustBeGeneratedDescription_component')}
                    </ModalSectionParagraph>
                </ModalSection>
            )}
            <ModalSection>
                <ModalSectionHeader strong>{t('authentification.generateNewLink')}</ModalSectionHeader>
                <ModalSectionParagraph>
                    <Trans
                        {...{
                            i18nKey: 'authentification.generateNewLinkDescription_component',
                            components: { bold: <b /> },
                        }}
                    />
                </ModalSectionParagraph>
                <CreateResetTokenButton onClick={createNativeUserResetToken} size="small" type="text">
                    <RedoOutlined style={{}} />
                </CreateResetTokenButton>
            </ModalSection>
        </Modal>
    );
}
