import { Button, Empty, Image, message, Modal, Tag, Tooltip, Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { DeleteOutlined, DownOutlined, RightOutlined, StopOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { DatasetAssertionDescription } from './DatasetAssertionDescription';
import { StyledTable } from '../../../components/styled/StyledTable';
import { DatasetAssertionDetails } from './DatasetAssertionDetails';
import { Assertion, AssertionRunStatus } from '../../../../../../types.generated';
import { getResultColor, getResultIcon, getResultText } from './assertionUtils';
import { useDeleteAssertionMutation } from '../../../../../../graphql/assertion.generated';
import { capitalizeFirstLetterOnly } from '../../../../../shared/textUtil';

const ResultContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: left;
`;

const ResultTypeText = styled(Typography.Text)`
    margin-left: 8px;
`;

const ActionButtonContainer = styled.div`
    display: flex;
    justify-content: right;
    align-items: center;
`;

const PlatformContainer = styled.div`
    margin-right: 8px;
`;

type Props = {
    assertions: Array<Assertion>;
    onDelete?: (urn: string) => void;
};

/**
 * A list of assertions displaying their most recent run status, their human-readable
 * description, and platform.
 *
 * Currently this component supports rendering Dataset Assertions only.
 */
export const DatasetAssertionsList = ({ assertions, onDelete }: Props) => {
    const { t } = useTranslation();
    const [deleteAssertionMutation] = useDeleteAssertionMutation();

    const deleteAssertion = async (urn: string) => {
        try {
            await deleteAssertionMutation({
                variables: { urn },
            });
            message.success({
                content: t('crud.success.removeWithName', { name: t('common.assertion') }),
                duration: 2,
            });
        } catch (e: unknown) {
            message.destroy();
            if (e instanceof Error) {
                message.error({
                    content: `${t('crud.error.removeWithName', { name: t('common.assertion') })}: \n ${
                        e.message || ''
                    }`,
                    duration: 3,
                });
            }
        }
        onDelete?.(urn);
    };

    const onDeleteAssertion = (urn: string) => {
        Modal.confirm({
            title: t('crud.doYouWantTo.confirmRemovalWithName', { name: t('common.assertion') }),
            content: t('assertion.deleteAssertionModal.content'),
            onOk() {
                deleteAssertion(urn);
            },
            onCancel() {},
            okText: t('common.yes'),
            cancelText: t('common.cancel'),
            maskClosable: true,
            closable: true,
        });
    };

    const assertionsTableData = assertions.map((assertion) => ({
        urn: assertion.urn,
        type: assertion.info?.type,
        platform: assertion.platform,
        datasetAssertionInfo: assertion.info?.datasetAssertion,
        lastExecTime: assertion.runEvents?.runEvents?.length && assertion.runEvents.runEvents[0].timestampMillis,
        lastExecResult:
            assertion.runEvents?.runEvents?.length &&
            assertion.runEvents.runEvents[0].status === AssertionRunStatus.Complete &&
            assertion.runEvents.runEvents[0].result?.type,
    }));

    const assertionsTableCols = [
        {
            title: '',
            dataIndex: '',
            key: '',
            render: (_, record: any) => {
                const executionDate = record.lastExecTime && new Date(record.lastExecTime);
                const localTime = executionDate && `${executionDate.toLocaleDateString()}`;
                const resultColor = (record.lastExecResult && getResultColor(record.lastExecResult)) || 'default';
                const resultText =
                    (record.lastExecResult && getResultText(record.lastExecResult)) || t('assertion.noEvaluations');
                const resultIcon = (record.lastExecResult && getResultIcon(record.lastExecResult)) || <StopOutlined />;
                return (
                    <ResultContainer>
                        <div>
                            <Tooltip
                                title={
                                    (localTime && t('assertion.lastEvaluatedWithDate', { date: localTime })) ||
                                    t('assertion.noEvaluations')
                                }
                            >
                                <Tag style={{ borderColor: resultColor }}>
                                    {resultIcon}
                                    <ResultTypeText style={{ color: resultColor }}>{resultText}</ResultTypeText>
                                </Tag>
                            </Tooltip>
                        </div>
                        <DatasetAssertionDescription assertionInfo={record.datasetAssertionInfo} />
                    </ResultContainer>
                );
            },
        },
        {
            title: '',
            dataIndex: '',
            key: '',
            render: (_, record: any) => (
                <ActionButtonContainer>
                    <Tooltip
                        title={
                            record.platform.properties?.displayName || capitalizeFirstLetterOnly(record.platform.name)
                        }
                    >
                        <PlatformContainer>
                            {(record.platform.properties?.logoUrl && (
                                <Image
                                    preview={false}
                                    height={20}
                                    width={20}
                                    src={record.platform.properties?.logoUrl}
                                />
                            )) || (
                                <Typography.Text>
                                    {record.platform.properties?.displayName ||
                                        capitalizeFirstLetterOnly(record.platform.name)}
                                </Typography.Text>
                            )}
                        </PlatformContainer>
                    </Tooltip>
                    <Button onClick={() => onDeleteAssertion(record.urn)} type="text" shape="circle" danger>
                        <DeleteOutlined />
                    </Button>
                </ActionButtonContainer>
            ),
        },
    ];

    return (
        <>
            <StyledTable
                columns={assertionsTableCols}
                dataSource={assertionsTableData}
                rowKey="urn"
                locale={{
                    emptyText: (
                        <Empty
                            description={`${t('assertion.noAssertionsFound')} :(`}
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    ),
                }}
                expandable={{
                    defaultExpandAllRows: false,
                    expandRowByClick: true,
                    expandedRowRender: (record) => {
                        return <DatasetAssertionDetails urn={record.urn} lastEvaluatedAtMillis={record.lastExecTime} />;
                    },
                    expandIcon: ({ expanded, onExpand, record }: any) =>
                        expanded ? (
                            <DownOutlined style={{ fontSize: 8 }} onClick={(e) => onExpand(record, e)} />
                        ) : (
                            <RightOutlined style={{ fontSize: 8 }} onClick={(e) => onExpand(record, e)} />
                        ),
                }}
                showHeader={false}
                pagination={false}
            />
        </>
    );
};
