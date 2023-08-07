import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { Button, Input, Modal, Spin, notification } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { AndFilterInput } from '../../../../../../types.generated';
import { getSearchCsvDownloadHeader, transformResultsToCsvRow } from './downloadAsCsvUtil';
import { downloadRowsAsCsv } from '../../../../../search/utils/csvUtils';
import { useEntityRegistry } from '../../../../../useEntityRegistry';
import { useEntityData } from '../../../EntityContext';
import analytics, { EventType } from '../../../../../analytics';
import { DownloadSearchResultsInput, DownloadSearchResults } from '../../../../../search/utils/types';

type Props = {
    downloadSearchResults: (input: DownloadSearchResultsInput) => Promise<DownloadSearchResults | null | undefined>;
    filters: AndFilterInput[];
    query: string;
    viewUrn?: string;
    totalResults?: number;
    setIsDownloadingCsv: (isDownloadingCsv: boolean) => any;
    showDownloadAsCsvModal: boolean;
    setShowDownloadAsCsvModal: (showDownloadAsCsvModal: boolean) => any;
};

const SEARCH_PAGE_SIZE_FOR_DOWNLOAD = 500;

export default function DownloadAsCsvModal({
    downloadSearchResults,
    filters,
    query,
    viewUrn,
    totalResults,
    setIsDownloadingCsv,
    showDownloadAsCsvModal,
    setShowDownloadAsCsvModal,
}: Props) {
    const { t } = useTranslation();
    const { entityData: entitySearchIsEmbeddedWithin } = useEntityData();
    const location = useLocation();

    const [saveAsTitle, setSaveAsTitle] = useState(
        entitySearchIsEmbeddedWithin ? `${entitySearchIsEmbeddedWithin.name}_impact.csv` : 'results.csv',
    );
    const entityRegistry = useEntityRegistry();
    const openNotification = () => {
        notification.info({
            message: t('share.csv.preparing.message'),
            description: totalResults
                ? t('share.csv.preparing.descriptionWithCount', { count: totalResults })
                : t('share.csv.preparing.description'),
            placement: 'bottomRight',
            duration: null,
            icon: <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />,
        });
    };

    const closeNotification = () => {
        setTimeout(() => {
            notification.destroy();
        }, 3000);
    };

    const showFailedDownloadNotification = () => {
        notification.destroy();
        notification.error({
            message: t('share.csv.error.message'),
            description: t('share.csv.error.description'),
            placement: 'bottomRight',
            duration: 3,
        });
    };

    const triggerCsvDownload = (filename) => {
        setIsDownloadingCsv(true);
        openNotification();

        let nextScrollId: string | null = null;
        let accumulatedResults: string[][] = [];

        analytics.event({
            type: EventType.DownloadAsCsvEvent,
            query,
            entityUrn: entitySearchIsEmbeddedWithin?.urn,
            path: location.pathname,
        });

        function fetchNextPage() {
            downloadSearchResults({
                scrollId: nextScrollId,
                query,
                count: SEARCH_PAGE_SIZE_FOR_DOWNLOAD,
                orFilters: filters,
                viewUrn,
            })
                .then((refetchData) => {
                    accumulatedResults = [
                        ...accumulatedResults,
                        ...transformResultsToCsvRow(refetchData?.searchResults || [], entityRegistry),
                    ];
                    // If we have a "next offset", then we continue.
                    // Otherwise, we terminate fetching.
                    if (refetchData?.nextScrollId) {
                        nextScrollId = refetchData?.nextScrollId;
                        fetchNextPage();
                    } else {
                        setIsDownloadingCsv(false);
                        closeNotification();
                        downloadRowsAsCsv(
                            getSearchCsvDownloadHeader(refetchData?.searchResults[0]),
                            accumulatedResults,
                            filename,
                        );
                    }
                })
                .catch((_) => {
                    setIsDownloadingCsv(false);
                    showFailedDownloadNotification();
                });
        }
        fetchNextPage();
    };

    return (
        <Modal
            centered
            onCancel={() => setShowDownloadAsCsvModal(false)}
            title={t('share.downloadAs')}
            visible={showDownloadAsCsvModal}
            footer={
                <>
                    <Button onClick={() => setShowDownloadAsCsvModal(false)} type="text">
                        {t('common.close')}
                    </Button>
                    <Button
                        onClick={() => {
                            setShowDownloadAsCsvModal(false);
                            triggerCsvDownload(saveAsTitle);
                        }}
                        disabled={saveAsTitle.length === 0}
                    >
                        {t('common.download')}
                    </Button>
                </>
            }
        >
            <Input
                placeholder="datahub.csv"
                value={saveAsTitle}
                onChange={(e) => {
                    setSaveAsTitle(e.target.value);
                }}
            />
        </Modal>
    );
}
