import React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { EntityType } from '../../../types.generated';
import analytics, { EventType, EntityActionType } from '../../analytics';
import UrlButton from './UrlButton';

const GITHUB_LINK = 'github.com';
const GITHUB = 'GitHub';

interface Props {
    externalUrl: string;
    platformName?: string;
    entityUrn: string;
    entityType?: string;
}

export default function ExternalUrlButton({ externalUrl, platformName, entityType, entityUrn }: Props) {
    const { t } = useTranslation();

    function sendAnalytics() {
        analytics.event({
            type: EventType.EntityActionEvent,
            actionType: EntityActionType.ClickExternalUrl,
            entityType: entityType as EntityType,
            entityUrn,
        });
    }

    let displayedName = platformName;
    if (externalUrl.toLocaleLowerCase().includes(GITHUB_LINK)) {
        displayedName = GITHUB;
    }

    return (
        <UrlButton href={externalUrl} onClick={sendAnalytics}>
            {displayedName ? t('navigation.viewInWithName', { name: displayedName }) : t('navigation.viewLink')}
        </UrlButton>
    );
}
