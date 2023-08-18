import { render } from '@testing-library/react';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { toRelativeTimeString } from '../../../../../shared/time/timeUtils';
import SchemaTimeStamps from '../../schema/components/SchemaTimeStamps';
import i18n from '../../../../../../i18n-test';

describe('SchemaTimeStamps', () => {
    it('should render last observed text if lastObserved is not null', () => {
        const { getByText, queryByText } = render(
            <I18nextProvider i18n={i18n}>
                <SchemaTimeStamps lastUpdated={123} lastObserved={123} />
            </I18nextProvider>,
        );
        expect(getByText(`Last observed ${toRelativeTimeString(123, 'en')}`)).toBeInTheDocument();
        expect(queryByText(`Reported ${toRelativeTimeString(123, 'en')}`)).toBeNull();
    });

    it('should render last updated text if lastObserved is null', () => {
        const { getByText, queryByText } = render(<SchemaTimeStamps lastUpdated={123} lastObserved={null} />);
        expect(queryByText(`Last observed ${toRelativeTimeString(123, 'en')}`)).toBeNull();
        expect(getByText(`Reported ${toRelativeTimeString(123, 'en')}`)).toBeInTheDocument();
    });

    it('should return null if lastUpdated and lastObserved are both null', () => {
        const { container } = render(<SchemaTimeStamps lastUpdated={null} lastObserved={null} />);
        expect(container.firstChild).toBeNull();
    });
});
