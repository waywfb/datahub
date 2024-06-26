import React from 'react';
import styled from 'styled-components';
import { EditOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const EditQueryActionButton = styled(Button)`
    && {
        margin: 0;
        padding: 0 4px 0 4px;
    }
`;

export type Props = {
    onClickEdit?: () => void;
    index?: number;
};

export default function QueryCardEditButton({ onClickEdit, index }: Props) {
    return (
        <EditQueryActionButton type="text" onClick={onClickEdit} data-testid={`query-edit-button-${index}`}>
            <EditOutlined />
        </EditQueryActionButton>
    );
}
