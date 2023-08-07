import { ArrowDownOutlined, ArrowUpOutlined, MoreOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Popover, Tooltip } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Trans, useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import FocusIcon from '../../../images/focus.svg';
import { Direction, DirectionTrans, UpdatedLineages } from '../types';
import { EntityType } from '../../../types.generated';
import ManageLineageModal from './ManageLineageModal';
import { ENTITY_TYPES_WITH_MANUAL_LINEAGE } from '../../entity/shared/constants';

const DROPDOWN_Z_INDEX = 1;
const POPOVER_Z_INDEX = 2;
const UNAUTHORIZED_TEXT = 'lineage.youAreNOtAuthToEditLineage';

const StyledImage = styled.img`
    width: 12px;
`;

const UnderlineWrapper = styled.span`
    text-decoration: underline;
    cursor: pointer;
`;

const StyledMenuItem = styled(Menu.Item)`
    padding: 0;
`;

const MenuItemContent = styled.div`
    padding: 5px 12px;
`;

function PopoverContent({ centerEntity, direction }: { centerEntity?: () => void; direction: string }) {
    const { t } = useTranslation();

    return (
        <div>
            <Trans
                {...{
                    i18nKey: 'lineage.focusOnThisEntityToMakeEdit_component',
                    values: {
                        direction: t(direction).toLowerCase(),
                    },
                    components: { wrapper: <UnderlineWrapper onClick={centerEntity} /> },
                }}
            />
        </div>
    );
}

function getDownstreamDisabledPopoverContent(
    t: TFunction,
    canEditLineage: boolean,
    isDashboard: boolean,
    centerEntity?: () => void,
) {
    if (!canEditLineage) {
        return t(UNAUTHORIZED_TEXT);
    }
    if (isDashboard) {
        return t('lineage.dashboardHasNoDownstreamLineage');
    }
    return <PopoverContent centerEntity={centerEntity} direction={DirectionTrans[Direction.Downstream]} />;
}

interface Props {
    entityUrn: string;
    refetchEntity: () => void;
    setUpdatedLineages: React.Dispatch<React.SetStateAction<UpdatedLineages>>;
    disableUpstream?: boolean;
    disableDownstream?: boolean;
    centerEntity?: () => void;
    showLoading?: boolean;
    menuIcon?: React.ReactNode;
    entityType?: EntityType;
    entityPlatform?: string;
    canEditLineage?: boolean;
    disableDropdown?: boolean;
}

export default function ManageLineageMenu({
    entityUrn,
    refetchEntity,
    setUpdatedLineages,
    disableUpstream,
    disableDownstream,
    centerEntity,
    showLoading,
    menuIcon,
    entityType,
    entityPlatform,
    canEditLineage,
    disableDropdown,
}: Props) {
    const { t } = useTranslation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [lineageDirection, setLineageDirection] = useState<Direction>(Direction.Upstream);

    function manageLineage(direction: Direction) {
        setIsModalVisible(true);
        setLineageDirection(direction);
    }

    const isCenterNode = !disableUpstream && !disableDownstream;
    const isDashboard = entityType === EntityType.Dashboard;
    const isDownstreamDisabled = disableDownstream || isDashboard || !canEditLineage;
    const isUpstreamDisabled = disableUpstream || !canEditLineage;
    const isManualLineageSupported = entityType && ENTITY_TYPES_WITH_MANUAL_LINEAGE.has(entityType);

    // if we don't show manual lineage options or the center node option, this menu has no options
    if (!isManualLineageSupported && isCenterNode) return null;

    return (
        <>
            <Tooltip title={disableDropdown ? t(UNAUTHORIZED_TEXT) : ''}>
                <div>
                    <Dropdown
                        overlayStyle={{ zIndex: DROPDOWN_Z_INDEX }}
                        disabled={disableDropdown}
                        overlay={
                            <Menu>
                                {isManualLineageSupported && (
                                    <>
                                        <StyledMenuItem
                                            key="0"
                                            onClick={() => manageLineage(Direction.Upstream)}
                                            disabled={isUpstreamDisabled}
                                        >
                                            <Popover
                                                content={
                                                    !canEditLineage ? (
                                                        t(UNAUTHORIZED_TEXT)
                                                    ) : (
                                                        <PopoverContent
                                                            centerEntity={centerEntity}
                                                            direction={DirectionTrans[Direction.Upstream]}
                                                        />
                                                    )
                                                }
                                                overlayStyle={
                                                    isUpstreamDisabled
                                                        ? { zIndex: POPOVER_Z_INDEX }
                                                        : { display: 'none' }
                                                }
                                            >
                                                <MenuItemContent>
                                                    <ArrowUpOutlined />
                                                    &nbsp; {`${t('common.edit')} ${t('common.upstream')}`}
                                                </MenuItemContent>
                                            </Popover>
                                        </StyledMenuItem>
                                        <StyledMenuItem
                                            key="1"
                                            onClick={() => manageLineage(Direction.Downstream)}
                                            disabled={isDownstreamDisabled}
                                        >
                                            <Popover
                                                content={getDownstreamDisabledPopoverContent(
                                                    t,
                                                    !!canEditLineage,
                                                    isDashboard,
                                                    centerEntity,
                                                )}
                                                overlayStyle={
                                                    isDownstreamDisabled
                                                        ? { zIndex: POPOVER_Z_INDEX }
                                                        : { display: 'none' }
                                                }
                                            >
                                                <MenuItemContent>
                                                    <ArrowDownOutlined />
                                                    &nbsp; {`${t('common.edit')} ${t('common.downstream')}`}
                                                </MenuItemContent>
                                            </Popover>
                                        </StyledMenuItem>
                                    </>
                                )}
                                {!isCenterNode && centerEntity && (
                                    <Menu.Item key="2" onClick={centerEntity}>
                                        <StyledImage src={FocusIcon} alt={t('lineage.focusOnEntity').toLowerCase()} />
                                        &nbsp; {t('lineage.focusOnEntity')}
                                    </Menu.Item>
                                )}
                            </Menu>
                        }
                        trigger={['click']}
                    >
                        {menuIcon || <MoreOutlined style={{ fontSize: 18 }} />}
                    </Dropdown>
                </div>
            </Tooltip>
            {isModalVisible && (
                <ManageLineageModal
                    entityUrn={entityUrn}
                    lineageDirection={lineageDirection}
                    closeModal={() => setIsModalVisible(false)}
                    refetchEntity={refetchEntity}
                    setUpdatedLineages={setUpdatedLineages}
                    showLoading={showLoading}
                    entityType={entityType}
                    entityPlatform={entityPlatform}
                />
            )}
        </>
    );
}
