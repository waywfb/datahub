import { message, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEntityRegistry } from '../../../useEntityRegistry';
import { useEntityData, useRefetch } from '../../shared/EntityContext';
import { useRemoveRelatedTermsMutation } from '../../../../graphql/glossaryTerm.generated';
import { TermRelationshipType } from '../../../../types.generated';

function useRemoveRelatedTerms(termUrn: string, relationshipType: TermRelationshipType, displayName: string) {
    const { t } = useTranslation();
    const { urn, entityType } = useEntityData();
    const entityRegistry = useEntityRegistry();
    const refetch = useRefetch();

    const [removeRelatedTerms] = useRemoveRelatedTermsMutation();

    function handleRemoveRelatedTerms() {
        removeRelatedTerms({
            variables: {
                input: {
                    urn,
                    termUrns: [termUrn],
                    relationshipType,
                },
            },
        })
            .catch((e) => {
                message.destroy();
                message.error({ content: `Failed to remove: \n ${e.message || ''}`, duration: 3 });
            })
            .finally(() => {
                message.loading({
                    content: 'Removing...',
                    duration: 2,
                });
                setTimeout(() => {
                    refetch();
                    message.success({
                        content: `Removed Glossary Term!`,
                        duration: 2,
                    });
                }, 2000);
            });
    }

    function onRemove() {
        Modal.confirm({
            title: `Remove ${displayName}`,
            content: `Are you sure you want to remove this ${entityRegistry.getEntityName(entityType)}?`,
            onOk() {
                handleRemoveRelatedTerms();
            },
            onCancel() {},
            okText: t('common.yes'),
            cancelText: t('common.cancel'),
            maskClosable: true,
            closable: true,
        });
    }

    return { onRemove };
}

export default useRemoveRelatedTerms;
