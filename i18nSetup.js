import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import { Language } from './src/config/language';

export const initI18n = () => {
  i18n
    .use(initReactI18next)
    .init({
      resources: Language.resourcesLanguage,
      lng: Language.defaultLanguage,
      fallbackLng: Language.defaultLanguage,
      compatibilityJSON: 'v3',
    });
};
