import { BookOutlined } from '@ant-design/icons';
import { message, Modal, Tag } from 'antd';
import React from 'react';
import styled from 'styled-components';
import Highlight from 'react-highlighter';
import { useTranslation } from 'react-i18next';
import { useRemoveTermMutation } from '../../../../graphql/mutations.generated';
import { EntityType, GlossaryTermAssociation, SubResourceType } from '../../../../types.generated';
import { useEntityRegistry } from '../../../useEntityRegistry';
import { useHasMatchedFieldByUrn } from '../../../search/context/SearchResultContext';

const highlightMatchStyle = { background: '#ffe58f', padding: '0' };

const StyledTag = styled(Tag)<{ fontSize?: number; highlightTerm?: boolean }>`
    &&& {
        ${(props) =>
            props.highlightTerm &&
            `
                background: ${props.theme.styles['highlight-color']};
                border: 1px solid ${props.theme.styles['highlight-border-color']};
            `}
    }
    ${(props) => props.fontSize && `font-size: ${props.fontSize}px;`}
`;

interface Props {
    term: GlossaryTermAssociation;
    entityUrn?: string;
    entitySubresource?: string;
    canRemove?: boolean;
    readOnly?: boolean;
    highlightText?: string;
    fontSize?: number;
    onOpenModal?: () => void;
    refetch?: () => Promise<any>;
}

export default function TermContent({
    term,
    entityUrn,
    entitySubresource,
    canRemove,
    readOnly,
    highlightText,
    fontSize,
    onOpenModal,
    refetch,
}: Props) {
    const entityRegistry = useEntityRegistry();
    const { t } = useTranslation();
    const [removeTermMutation] = useRemoveTermMutation();
    const highlightTerm = useHasMatchedFieldByUrn(term.term.urn, 'glossaryTerms');

    const removeTerm = (termToRemove: GlossaryTermAssociation) => {
        onOpenModal?.();
        const termName = termToRemove && entityRegistry.getDisplayName(termToRemove.term.type, termToRemove.term);
        Modal.confirm({
            title: t('crud.doYouWantTo.removeTitleWithName', {
                name: `${termName} ${entityRegistry.getEntityNameTrans(EntityType.GlossaryTerm, t).toLowerCase()}`,
            }),
            content: t('crud.doYouWantTo.removeContentWithTheName', {
                name: `${termName} ${entityRegistry.getEntityNameTrans(EntityType.GlossaryTerm, t).toLowerCase()}`,
            }),
            onOk() {
                if (termToRemove.associatedUrn || entityUrn) {
                    removeTermMutation({
                        variables: {
                            input: {
                                termUrn: termToRemove.term.urn,
                                resourceUrn: termToRemove.associatedUrn || entityUrn || '',
                                subResource: entitySubresource,
                                subResourceType: entitySubresource ? SubResourceType.DatasetField : null,
                            },
                        },
                    })
                        .then(({ errors }) => {
                            if (!errors) {
                                message.success({
                                    content: t('crud.success.removeWithName', {
                                        name: entityRegistry.getEntityNameTrans(EntityType.GlossaryTerm, t),
                                    }),
                                    duration: 2,
                                });
                            }
                        })
                        .then(refetch)
                        .catch((e) => {
                            message.destroy();
                            message.error({
                                content: `${t('crud.error.removeWithName', {
                                    name: entityRegistry.getEntityNameTrans(EntityType.GlossaryTerm, t),
                                })}: \n ${e.message || ''}`,
                                duration: 3,
                            });
                        });
                }
            },
            onCancel() {},
            okText: t('common.yes'),
            cancelText: t('common.cancel'),
            maskClosable: true,
            closable: true,
        });
    };

    return (
        <StyledTag
            style={{ cursor: 'pointer' }}
            closable={canRemove && !readOnly}
            onClose={(e) => {
                e.preventDefault();
                removeTerm(term);
            }}
            fontSize={fontSize}
            highlightTerm={highlightTerm}
        >
            <BookOutlined style={{ marginRight: '4px' }} />
            <Highlight style={{ marginLeft: 0 }} matchStyle={highlightMatchStyle} search={highlightText}>
                {entityRegistry.getDisplayName(EntityType.GlossaryTerm, term.term)}
            </Highlight>
        </StyledTag>
    );
}
