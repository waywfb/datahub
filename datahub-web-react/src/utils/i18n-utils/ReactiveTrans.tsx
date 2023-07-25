import { Trans, useTranslation } from 'react-i18next';

export const ReactiveTrans = (props: React.ComponentProps<typeof Trans>) => {
    const { t, i18n } = useTranslation(props.ns);
    return Trans({ t, i18n, ...props });
};
