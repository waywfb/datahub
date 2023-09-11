import { message, Typography } from 'antd';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { useUpdateNameMutation } from '../../../../../../graphql/mutations.generated';
import { getParentNodeToUpdate, updateGlossarySidebar } from '../../../../../glossary/utils';
import { useEntityRegistry } from '../../../../../useEntityRegistry';
import { useEntityData, useRefetch } from '../../../EntityContext';
import { useGlossaryEntityData } from '../../../GlossaryEntityContext';

const EntityTitle = styled(Typography.Title)`
    margin-right: 10px;

    &&& {
        margin-bottom: 0;
        word-break: break-all;
    }

    .ant-typography-edit {
        font-size: 16px;
        margin-left: 10px;
    }
`;

interface Props {
    isNameEditable?: boolean;
}

function EntityName(props: Props) {
    const { isNameEditable } = props;
    const refetch = useRefetch();
    const entityRegistry = useEntityRegistry();
    const { t } = useTranslation();
    const { isInGlossaryContext, urnsToUpdate, setUrnsToUpdate } = useGlossaryEntityData();
    const { urn, entityType, entityData } = useEntityData();
    const entityName = entityData ? entityRegistry.getDisplayName(entityType, entityData) : '';
    const [updatedName, setUpdatedName] = useState(entityName);

    useEffect(() => {
        setUpdatedName(entityName);
    }, [entityName]);

    const [updateName] = useUpdateNameMutation();

    const handleSaveName = (name: string) => {
        setUpdatedName(name);
        updateName({ variables: { input: { name, urn } } })
            .then(() => {
                message.success({ content: t('crud.success.updateWithName', { name: t('common.name') }), duration: 2 });
                refetch();
                if (isInGlossaryContext) {
                    const parentNodeToUpdate = getParentNodeToUpdate(entityData, entityType);
                    updateGlossarySidebar([parentNodeToUpdate], urnsToUpdate, setUrnsToUpdate);
                }
            })
            .catch((e: unknown) => {
                message.destroy();
                if (e instanceof Error) {
                    message.error({
                        content: `${t('crud.error.updateWithName', { name: t('common.name') })}: \n ${e.message || ''}`,
                        duration: 3,
                    });
                }
            });
    };

    return (
        <>
            {isNameEditable ? (
                <EntityTitle level={3} editable={{ onChange: handleSaveName }}>
                    {updatedName}
                </EntityTitle>
            ) : (
                <EntityTitle level={3}>
                    {entityData && entityRegistry.getDisplayName(entityType, entityData)}
                </EntityTitle>
            )}
        </>
    );
}

export default EntityName;
