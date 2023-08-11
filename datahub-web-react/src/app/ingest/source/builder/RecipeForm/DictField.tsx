import React from 'react';
import { Button, Form, Input, Tooltip } from 'antd';
import { red } from '@ant-design/colors';
import styled from 'styled-components/macro';
import { DeleteOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { ANTD_GRAY } from '../../../../entity/shared/constants';
import { RecipeField } from './common';
import { StyledFormItem } from './SecretField/SecretField';

export const Label = styled.div`
    font-weight: bold;
    padding-bottom: 8px;
`;

export const StyledButton = styled(Button)`
    color: ${ANTD_GRAY[7]};
    margin: 10px 0 0 30px;
    width: calc(100% - 72px);
`;

export const StyledQuestion = styled(QuestionCircleOutlined)`
    color: rgba(0, 0, 0, 0.45);
    margin-left: 4px;
`;

export const ListWrapper = styled.div<{ removeMargin: boolean }>`
    margin-bottom: ${(props) => (props.removeMargin ? '0' : '16px')};
`;

const SectionWrapper = styled.div`
    align-items: center;
    display: flex;
    padding: 8px 0 0 30px;
    &:hover {
        background-color: ${ANTD_GRAY[2]};
    }
`;

const FieldsWrapper = styled.div`
    flex: 1;
`;

const StyledDeleteButton = styled(Button)`
    margin-left: 10px;
`;

export const ErrorWrapper = styled.div`
    color: ${red[5]};
    margin-top: 5px;
`;

interface Props {
    field: RecipeField;
    removeMargin?: boolean;
}

export default function DictField({ field, removeMargin }: Props) {
    const { t } = useTranslation();
    return (
        <Form.List name={field.name} rules={field.rules || undefined}>
            {(fields, { add, remove }, { errors }) => (
                <ListWrapper removeMargin={!!removeMargin}>
                    <Label>
                        {t(field.label)}
                        <Tooltip overlay={typeof field.tooltip === 'string' ? t(field.tooltip) : field.tooltip}>
                            <StyledQuestion />
                        </Tooltip>
                    </Label>
                    {fields.map(({ key, name, ...restField }) => (
                        <SectionWrapper key={key}>
                            <FieldsWrapper>
                                {field.keyField && (
                                    <StyledFormItem
                                        {...restField}
                                        required={field.required}
                                        name={[name, field.keyField.name]}
                                        initialValue=""
                                        label={t(field.keyField.label)}
                                        tooltip={
                                            typeof field.keyField.tooltip === 'string'
                                                ? t(field.keyField.tooltip)
                                                : field.keyField.tooltip
                                        }
                                        rules={field.keyField.rules || undefined}
                                    >
                                        <Input placeholder={field.keyField.placeholder} />
                                    </StyledFormItem>
                                )}
                                {field.fields?.map((f) => (
                                    <StyledFormItem
                                        {...restField}
                                        name={[name, f.name]}
                                        initialValue=""
                                        label={t(f.label)}
                                        tooltip={typeof f.tooltip === 'string' ? t(f.tooltip) : f.tooltip}
                                        rules={f.rules || undefined}
                                    >
                                        <Input placeholder={f.placeholder} />
                                    </StyledFormItem>
                                ))}
                            </FieldsWrapper>
                            <StyledDeleteButton onClick={() => remove(name)} type="text" shape="circle" danger>
                                <DeleteOutlined />
                            </StyledDeleteButton>
                        </SectionWrapper>
                    ))}
                    <StyledButton type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                        {field.buttonLabel ? t(field.buttonLabel) : field.buttonLabel}
                    </StyledButton>
                    <ErrorWrapper>{errors}</ErrorWrapper>
                </ListWrapper>
            )}
        </Form.List>
    );
}
