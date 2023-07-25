import { TFunction } from 'i18next';
import { Entity as EntityInterface, EntityType, SearchResult } from '../../types.generated';
import { FetchedEntity } from '../lineage/types';
import { Entity, EntityCapabilityType, IconStyleType, PreviewType } from './Entity';
import { GLOSSARY_ENTITY_TYPES } from './shared/constants';
import { GenericEntityProperties } from './shared/types';
import { dictToQueryStringParams, getFineGrainedLineageWithSiblings, urlEncodeUrn } from './shared/utils';

function validatedGet<K, V>(key: K, map: Map<K, V>): V {
    if (map.has(key)) {
        return map.get(key) as V;
    }
    throw new Error(`Unrecognized key ${key} provided in map ${JSON.stringify(map)}`);
}

/**
 * Serves as a singleton registry for all DataHub entities to appear on the frontend.
 */
export default class EntityRegistry {
    entities: Array<Entity<any>> = new Array<Entity<any>>();

    entityTypeToEntity: Map<EntityType, Entity<any>> = new Map<EntityType, Entity<any>>();

    collectionNameToEntityType: Map<string, EntityType> = new Map<string, EntityType>();

    pathNameToEntityType: Map<string, EntityType> = new Map<string, EntityType>();

    // TODO ndespouy getCollectionName
    register(entity: Entity<any>) {
        this.entities.push(entity);
        this.entityTypeToEntity.set(entity.type, entity);
        this.collectionNameToEntityType.set(entity.getCollectionName(), entity.type);
        this.pathNameToEntityType.set(entity.getPathName(), entity.type);
    }

    getEntity(type: EntityType): Entity<any> {
        return validatedGet(type, this.entityTypeToEntity);
    }

    hasEntity(type: EntityType): boolean {
        return this.entityTypeToEntity.has(type);
    }

    getEntities(): Array<Entity<any>> {
        return this.entities;
    }

    getNonGlossaryEntities(): Array<Entity<any>> {
        return this.entities.filter((entity) => !GLOSSARY_ENTITY_TYPES.includes(entity.type));
    }

    getGlossaryEntities(): Array<Entity<any>> {
        return this.entities.filter((entity) => GLOSSARY_ENTITY_TYPES.includes(entity.type));
    }

    getSearchEntityTypes(): Array<EntityType> {
        return this.entities.filter((entity) => entity.isSearchEnabled()).map((entity) => entity.type);
    }

    getDefaultSearchEntityType(): EntityType {
        return this.entities[0].type;
    }

    getBrowseEntityTypes(): Array<EntityType> {
        return this.entities.filter((entity) => entity.isBrowseEnabled()).map((entity) => entity.type);
    }

    getLineageEntityTypes(): Array<EntityType> {
        return this.entities.filter((entity) => entity.isLineageEnabled()).map((entity) => entity.type);
    }

    getIcon(type: EntityType, fontSize: number, styleType: IconStyleType, color?: string): JSX.Element {
        const entity = validatedGet(type, this.entityTypeToEntity);
        return entity.icon(fontSize, styleType, color);
    }

    // TODO ndespouy remplacer tout ces appels par getEntityNameTrans
    getCollectionName(type: EntityType): string {
        const entity = validatedGet(type, this.entityTypeToEntity);
        return entity.getCollectionName();
    }

    // TODO ndespouy remplacer tout ces appels par getEntityNameTrans
    getEntityName(type: EntityType): string | undefined {
        const entity = validatedGet(type, this.entityTypeToEntity);
        return entity.getEntityName?.();
    }

    getCollectionNameTrans(type: EntityType, t: TFunction): string {
        return this.getEntityNameTrans(type, t, 2);
    }

    getEntityNameTrans(type: EntityType, t: TFunction, count = 1): string {
        const entity = validatedGet(type, this.entityTypeToEntity);
        return t(entity.type, { count });
    }

    getTypeFromCollectionName(name: string): EntityType {
        return validatedGet(name, this.collectionNameToEntityType);
    }

    getPathName(type: EntityType): string {
        const entity = validatedGet(type, this.entityTypeToEntity);
        return entity.getPathName();
    }

    getEntityUrl(type: EntityType, urn: string, params?: Record<string, string | boolean>): string {
        return `/${this.getPathName(type)}/${urlEncodeUrn(urn)}${params ? `?${dictToQueryStringParams(params)}` : ''}`;
    }

    getTypeFromPathName(pathName: string): EntityType {
        return validatedGet(pathName, this.pathNameToEntityType);
    }

    getTypeOrDefaultFromPathName(pathName: string, def?: EntityType): EntityType | undefined {
        try {
            return validatedGet(pathName, this.pathNameToEntityType);
        } catch (e) {
            return def;
        }
    }

    renderProfile(type: EntityType, urn: string): JSX.Element {
        const entity = validatedGet(type, this.entityTypeToEntity);
        return entity.renderProfile(urn);
    }

    renderPreview<T>(entityType: EntityType, type: PreviewType, data: T): JSX.Element {
        const entity = validatedGet(entityType, this.entityTypeToEntity);
        return entity.renderPreview(type, data);
    }

    renderSearchResult(type: EntityType, searchResult: SearchResult): JSX.Element {
        const entity = validatedGet(type, this.entityTypeToEntity);
        return entity.renderSearch(searchResult);
    }

    renderBrowse<T>(type: EntityType, data: T): JSX.Element {
        const entity = validatedGet(type, this.entityTypeToEntity);
        return entity.renderPreview(PreviewType.BROWSE, data);
    }

    // render the regular profile if embedded profile doesn't exist. Compact context should be set to true.
    renderEmbeddedProfile(type: EntityType, urn: string): JSX.Element {
        const entity = validatedGet(type, this.entityTypeToEntity);
        return entity.renderEmbeddedProfile ? entity.renderEmbeddedProfile(urn) : entity.renderProfile(urn);
    }

    getLineageVizConfig<T>(type: EntityType, data: T): FetchedEntity | undefined {
        const entity = validatedGet(type, this.entityTypeToEntity);
        const genericEntityProperties = this.getGenericEntityProperties(type, data);
        // combine fineGrainedLineages from this node as well as its siblings
        const fineGrainedLineages = getFineGrainedLineageWithSiblings(
            genericEntityProperties,
            (t: EntityType, d: EntityInterface) => this.getGenericEntityProperties(t, d),
        );
        return (
            ({
                ...entity.getLineageVizConfig?.(data),
                downstreamChildren: genericEntityProperties?.downstream?.relationships
                    ?.filter((relationship) => relationship.entity)
                    ?.map((relationship) => ({
                        entity: relationship.entity as EntityInterface,
                        type: (relationship.entity as EntityInterface).type,
                    })),
                downstreamRelationships: genericEntityProperties?.downstream?.relationships?.filter(
                    (relationship) => relationship.entity,
                ),
                numDownstreamChildren:
                    (genericEntityProperties?.downstream?.total || 0) -
                    (genericEntityProperties?.downstream?.filtered || 0),
                upstreamChildren: genericEntityProperties?.upstream?.relationships
                    ?.filter((relationship) => relationship.entity)
                    ?.map((relationship) => ({
                        entity: relationship.entity as EntityInterface,
                        type: (relationship.entity as EntityInterface).type,
                    })),
                upstreamRelationships: genericEntityProperties?.upstream?.relationships?.filter(
                    (relationship) => relationship.entity,
                ),
                numUpstreamChildren:
                    (genericEntityProperties?.upstream?.total || 0) -
                    (genericEntityProperties?.upstream?.filtered || 0),
                status: genericEntityProperties?.status,
                siblingPlatforms: genericEntityProperties?.siblingPlatforms,
                fineGrainedLineages,
                siblings: genericEntityProperties?.siblings,
                schemaMetadata: genericEntityProperties?.schemaMetadata,
                inputFields: genericEntityProperties?.inputFields,
                canEditLineage: genericEntityProperties?.privileges?.canEditLineage,
            } as FetchedEntity) || undefined
        );
    }

    getDisplayName<T>(type: EntityType, data: T): string {
        const entity = validatedGet(type, this.entityTypeToEntity);
        return entity.displayName(data);
    }

    getGenericEntityProperties<T>(type: EntityType, data: T): GenericEntityProperties | null {
        const entity = validatedGet(type, this.entityTypeToEntity);
        return entity.getGenericEntityProperties(data);
    }

    getSupportedEntityCapabilities(type: EntityType): Set<EntityCapabilityType> {
        const entity = validatedGet(type, this.entityTypeToEntity);
        return entity.supportedCapabilities();
    }

    getTypesWithSupportedCapabilities(capability: EntityCapabilityType): Set<EntityType> {
        return new Set(
            this.getEntities()
                .filter((entity) => entity.supportedCapabilities().has(capability))
                .map((entity) => entity.type),
        );
    }
}
