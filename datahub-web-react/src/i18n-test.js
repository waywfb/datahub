import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import intervalPlural from 'i18next-intervalplural-postprocessor';
import translationEN from './conf/locales/en/translation.json';

const resources = {
    en: {
        translation: translationEN,
    },
};

i18n.use(intervalPlural)
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', // Langue par défaut pour les tests
        fallbackLng: 'en',
        ns: ['translation', 'empty-message', 'form', 'react-cron', 'theme'],
        debug: true,
        defaultNs: 'translation',
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        react: {
            useSuspense: false,
        },
    });

export default i18n;
