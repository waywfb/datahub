import React, { ReactNode } from 'react';
import { AutoComplete, Divider, Form } from 'antd';
import { useApolloClient } from '@apollo/client';
import styled from 'styled-components/macro';
import { Trans, useTranslation } from 'react-i18next';
import { Secret } from '../../../../../../types.generated';
import CreateSecretButton from './CreateSecretButton';
import { RecipeField } from '../common';
import { ANTD_GRAY } from '../../../../../entity/shared/constants';
import { clearSecretListCache } from '../../../../secret/cacheUtils';

const StyledDivider = styled(Divider)`
    margin: 0;
`;

export const StyledFormItem = styled(Form.Item)<{
    alignLeft?: boolean;
    removeMargin?: boolean;
    isSecretField?: boolean;
}>`
    margin-bottom: ${(props) => (props.removeMargin ? '0' : '16px')};

    ${(props) =>
        props.alignLeft &&
        `
        .ant-form-item {
            flex-direction: row;

        }

        .ant-form-item-label {
            padding: 0;
            margin-right: 10px;
        }
    `}

    ${(props) =>
        props.isSecretField &&
        `
        .ant-form-item-label {
            &:after {
                content: 'Secret Field';
                color: ${ANTD_GRAY[7]};
                font-style: italic;
                font-weight: 100;
                margin-left: 5px;
                font-size: 10px;
            }
        }
    `}
`;

interface SecretFieldProps {
    field: RecipeField;
    secrets: Secret[];
    removeMargin?: boolean;
    refetchSecrets: () => void;
    updateFormValue: (field, value) => void;
}

function SecretFieldTooltip({ tooltipLabel }: { tooltipLabel?: string | ReactNode }) {
    return (
        <div>
            {tooltipLabel && (
                <>
                    {tooltipLabel}
                    <hr />
                </>
            )}
            <p>
                <Trans
                    {...{
                        i18nKey: 'ingest.secretFieldToolTip_component',
                        components: {
                            aLink: (
                                // eslint-disable-next-line jsx-a11y/control-has-associated-label, jsx-a11y/anchor-has-content
                                <a
                                    href="https://datahubproject.io/docs/ui-ingestion/#creating-a-secret"
                                    target="_blank"
                                    rel="noreferrer"
                                />
                            ),
                        },
                    }}
                />
            </p>
        </div>
    );
}

const encodeSecret = (secretName: string) => {
    return `\${${secretName}}`;
};

function SecretField({ field, secrets, removeMargin, updateFormValue, refetchSecrets }: SecretFieldProps) {
    const { t } = useTranslation();
    const options = secrets.map((secret) => ({ value: encodeSecret(secret.name), label: secret.name }));
    const apolloClient = useApolloClient();

    return (
        <StyledFormItem
            required={field.required}
            name={field.name}
            label={field.label}
            rules={field.rules || undefined}
            tooltip={<SecretFieldTooltip tooltipLabel={field?.tooltip} />}
            removeMargin={!!removeMargin}
            isSecretField
        >
            <AutoComplete
                placeholder={field.placeholder}
                filterOption={(input, option) => !!option?.value.toLowerCase().includes(input.toLowerCase())}
                notFoundContent={<>{t('ingest.noSecretsFound')}</>}
                options={options}
                dropdownRender={(menu) => {
                    return (
                        <>
                            {menu}
                            <StyledDivider />
                            <CreateSecretButton
                                onSubmit={(state) => {
                                    updateFormValue(field.name, encodeSecret(state.name as string));
                                    setTimeout(() => clearSecretListCache(apolloClient), 3000);
                                }}
                                refetchSecrets={refetchSecrets}
                            />
                        </>
                    );
                }}
            />
        </StyledFormItem>
    );
}

export default SecretField;
