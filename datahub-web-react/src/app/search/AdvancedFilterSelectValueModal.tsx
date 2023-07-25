import React from 'react';
import { useTranslation } from 'react-i18next';
import { FacetMetadata, EntityType } from '../../types.generated';
import { ContainerSelectModal } from '../entity/shared/containers/profile/sidebar/Container/ContainerSelectModal';
import { SetDomainModal } from '../entity/shared/containers/profile/sidebar/Domain/SetDomainModal';
import { EditOwnersModal } from '../entity/shared/containers/profile/sidebar/Ownership/EditOwnersModal';
import { SelectPlatformModal } from '../entity/shared/containers/profile/sidebar/Platform/SelectPlatformModal';
import EditTagTermsModal from '../shared/tags/AddTagsTermsModal';
import { ChooseEntityTypeModal } from './ChooseEntityTypeModal';
import { EditTextModal } from './EditTextModal';
import {
    CONTAINER_FILTER_NAME,
    DESCRIPTION_FILTER_NAME,
    DOMAINS_FILTER_NAME,
    ENTITY_FILTER_NAME,
    FIELD_DESCRIPTIONS_FILTER_NAME,
    FIELD_GLOSSARY_TERMS_FILTER_NAME,
    FIELD_PATHS_FILTER_NAME,
    FIELD_TAGS_FILTER_NAME,
    GLOSSARY_TERMS_FILTER_NAME,
    ORIGIN_FILTER_NAME,
    OWNERS_FILTER_NAME,
    PLATFORM_FILTER_NAME,
    REMOVED_FILTER_NAME,
    TAGS_FILTER_NAME,
    TYPE_NAMES_FILTER_NAME,
    DATA_PRODUCTS_FILTER_NAME,
} from './utils/constants';
import SetDataProductModal from '../entity/shared/containers/profile/sidebar/DataProduct/SetDataProductModal';
import { useEntityRegistry } from '../useEntityRegistry';

type Props = {
    facet?: FacetMetadata | null;
    filterField: string;
    onSelect: (values: string[]) => void;
    onCloseModal: () => void;
    initialValues?: string[];
};

export const AdvancedFilterSelectValueModal = ({
    filterField,
    onSelect,
    onCloseModal,
    initialValues,
    facet,
}: Props) => {
    const entityRegistry = useEntityRegistry();
    const { t } = useTranslation([]);
    if (filterField === OWNERS_FILTER_NAME) {
        return (
            <EditOwnersModal
                title={t('search.selectWithName', { name: t('common.owners') })}
                urns={[]}
                defaultValues={initialValues?.map((urn) => ({
                    urn,
                    entity: facet?.aggregations.find((aggregation) => aggregation.value === urn)?.entity,
                }))}
                onCloseModal={onCloseModal}
                hideOwnerType
                onOkOverride={(owners) => {
                    onSelect(owners.map((owner) => owner.value.ownerUrn));
                    onCloseModal();
                }}
            />
        );
    }
    if (filterField === DOMAINS_FILTER_NAME) {
        return (
            <SetDomainModal
                titleOverride={t('search.selectWithName', {
                    name: entityRegistry.getEntityNameTrans(EntityType.Domain, t),
                })}
                urns={[]}
                defaultValue={
                    initialValues?.map((urn) => ({
                        urn,
                        entity: facet?.aggregations.find((aggregation) => aggregation.value === urn)?.entity,
                    }))?.[0]
                }
                onCloseModal={onCloseModal}
                onOkOverride={(domainUrn) => {
                    onSelect([domainUrn]);
                    onCloseModal();
                }}
            />
        );
    }

    if (filterField === DATA_PRODUCTS_FILTER_NAME) {
        return (
            <SetDataProductModal
                titleOverride={t('search.selectWithName', { name: t('filter.dataProduct') })}
                urns={[]}
                currentDataProduct={
                    facet?.aggregations.find((agg) => initialValues?.includes(agg?.entity?.urn || ''))?.entity || null
                }
                onModalClose={onCloseModal}
                onOkOverride={(dataProductUrn) => {
                    onSelect([dataProductUrn]);
                    onCloseModal();
                }}
            />
        );
    }

    if (filterField === CONTAINER_FILTER_NAME) {
        return (
            <ContainerSelectModal
                titleOverride={t('search.selectWithName', {
                    name: entityRegistry.getEntityNameTrans(EntityType.Container, t),
                })}
                defaultValues={initialValues?.map((urn) => ({
                    urn,
                    entity: facet?.aggregations.find((aggregation) => aggregation.value === urn)?.entity,
                }))}
                onCloseModal={onCloseModal}
                onOkOverride={(containerUrns) => {
                    onSelect(containerUrns);
                    onCloseModal();
                }}
            />
        );
    }

    if (filterField === PLATFORM_FILTER_NAME) {
        return (
            <SelectPlatformModal
                defaultValues={initialValues?.map((urn) => ({
                    urn,
                    entity: facet?.aggregations.find((aggregation) => aggregation.value === urn)?.entity,
                }))}
                titleOverride={t('search.selectWithName', {
                    name: entityRegistry.getEntityNameTrans(EntityType.DataPlatform, t),
                })}
                onCloseModal={onCloseModal}
                onOk={(platformUrns) => {
                    onSelect(platformUrns);
                    onCloseModal();
                }}
            />
        );
    }

    if (filterField === FIELD_PATHS_FILTER_NAME) {
        return (
            <EditTextModal
                title={t('filter.filterByWithName', { name: t('common.column') })}
                defaultValue={initialValues?.[0]}
                onCloseModal={onCloseModal}
                onOk={(newValue) => {
                    onSelect([newValue]);
                    onCloseModal();
                }}
            />
        );
    }

    if (filterField === DESCRIPTION_FILTER_NAME || filterField === FIELD_DESCRIPTIONS_FILTER_NAME) {
        return (
            <EditTextModal
                title={t('filter.filterByWithName', { name: t('common.description') })}
                defaultValue={initialValues?.[0]}
                onCloseModal={onCloseModal}
                onOk={(newValue) => {
                    onSelect([newValue]);
                    onCloseModal();
                }}
            />
        );
    }

    if (filterField === ORIGIN_FILTER_NAME) {
        return (
            <EditTextModal
                title={t('filter.filterByWithName', { name: t('common.environment') })}
                defaultValue={initialValues?.[0]}
                onCloseModal={onCloseModal}
                onOk={(newValue) => {
                    onSelect([newValue]);
                    onCloseModal();
                }}
            />
        );
    }

    if (filterField === TYPE_NAMES_FILTER_NAME) {
        return (
            <EditTextModal
                title={t('filter.filterByWithName', { name: t('common.subtype') })}
                defaultValue={initialValues?.[0]}
                onCloseModal={onCloseModal}
                onOk={(newValue) => {
                    onSelect([newValue]);
                    onCloseModal();
                }}
            />
        );
    }

    if (filterField === ENTITY_FILTER_NAME) {
        return (
            <ChooseEntityTypeModal
                title={t('filter.filterByWithName', { name: t('common.entityType') })}
                defaultValues={initialValues}
                onCloseModal={onCloseModal}
                onOk={(newValues) => {
                    onSelect(newValues);
                    onCloseModal();
                }}
            />
        );
    }

    if (filterField === TAGS_FILTER_NAME || filterField === FIELD_TAGS_FILTER_NAME) {
        return (
            <EditTagTermsModal
                resources={[]}
                type={EntityType.Tag}
                visible
                onCloseModal={onCloseModal}
                onOkOverride={(urns) => {
                    onSelect(urns);
                    onCloseModal();
                }}
                defaultValues={initialValues?.map((urn) => ({
                    urn,
                    entity: facet?.aggregations.find((aggregation) => aggregation.value === urn)?.entity,
                }))}
            />
        );
    }

    if (filterField === REMOVED_FILTER_NAME) {
        onSelect(['true']);
        onCloseModal();
    }

    if (filterField === GLOSSARY_TERMS_FILTER_NAME || filterField === FIELD_GLOSSARY_TERMS_FILTER_NAME) {
        return (
            <EditTagTermsModal
                resources={[]}
                type={EntityType.GlossaryTerm}
                visible
                onCloseModal={onCloseModal}
                onOkOverride={(urns) => {
                    onSelect(urns);
                    onCloseModal();
                }}
                defaultValues={initialValues?.map((urn) => ({
                    urn,
                    entity: facet?.aggregations.find((aggregation) => aggregation.value === urn)?.entity,
                }))}
            />
        );
    }
    return null;
};
