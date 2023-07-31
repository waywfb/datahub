import React from 'react';
import { Form, Input, Select, Typography } from 'antd';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { PolicyType } from '../../../types.generated';
import { ReactiveTrans } from '../../../utils/i18n-utils/ReactiveTrans';

type Props = {
    policyType: string;
    setPolicyType: (type: PolicyType) => void;
    policyName: string;
    setPolicyName: (name: string) => void;
    policyDescription: string;
    setPolicyDescription: (description: string) => void;
};

const TypeForm = styled(Form)`
    margin: 12px;
    margin-top: 36px;
    > div {
        margin-bottom: 28px;
    }
`;

const TypeDescriptionParagraph = styled(Typography.Paragraph)`
    margin-top: 12px;
`;

export default function PolicyTypeForm({
    policyType,
    setPolicyType,
    policyName,
    setPolicyName,
    policyDescription,
    setPolicyDescription,
}: Props) {
    const { t } = useTranslation();
    const updatePolicyName = (name: string) => {
        setPolicyName(name);
    };

    return (
        <TypeForm layout="vertical">
            <Form.Item
                name="policyName"
                labelAlign="right"
                label={<Typography.Text strong>{t('common.name')}</Typography.Text>}
            >
                <Typography.Paragraph>{t('nameForNewPolicy')}</Typography.Paragraph>
                <Input
                    placeholder={t('placeholder.yourPolicyNamePlaceholder')}
                    value={policyName}
                    onChange={(event) => updatePolicyName(event.target.value)}
                />
            </Form.Item>
            <Form.Item name="policyType" label={<Typography.Text strong>{t('common.type')}</Typography.Text>}>
                <Typography.Paragraph>{t('permissions.typeOfPolicyToCreate')}</Typography.Paragraph>
                <Select defaultValue={policyType} onSelect={(value) => setPolicyType(value as PolicyType)}>
                    <Select.Option value={PolicyType.Platform}>{t('common.platform')}</Select.Option>
                    <Select.Option value={PolicyType.Metadata}>{t('common.metadata')}</Select.Option>
                </Select>
                <TypeDescriptionParagraph type="secondary">
                    <ReactiveTrans
                        {...{
                            i18nKey: 'permissions.typeOfPolicyDescription_html',
                        }}
                    />
                </TypeDescriptionParagraph>
            </Form.Item>
            <Form.Item
                name="policyDescription"
                labelAlign="right"
                label={<Typography.Text strong>{t('common.description')}</Typography.Text>}
            >
                <Typography.Paragraph>{t('permissions.newPolicyDescription')}</Typography.Paragraph>
                <Input
                    placeholder={t('placeholder.newPolicyDescriptionPlaceHolder')}
                    value={policyDescription}
                    onChange={(event) => setPolicyDescription(event.target.value)}
                />
            </Form.Item>
        </TypeForm>
    );
}
