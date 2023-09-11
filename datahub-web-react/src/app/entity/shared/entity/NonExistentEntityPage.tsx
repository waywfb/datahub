import { Result } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function NonExistentEntityPage() {
    const { t } = useTranslation();
    return <Result status="404" title={t('common.notFound')} subTitle={t('entity.cantFindEntityPageContent')} />;
}
