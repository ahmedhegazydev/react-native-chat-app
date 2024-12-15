import 'intl-messageformat'; // Import intl-messageformat for polyfill
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {en, ar} from './local';
import {I18nManager} from 'react-native';

// Force RTL layout
I18nManager.allowRTL(true);

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: I18nManager.isRTL ? 'ar' : 'en',
    fallbackLng: 'ar',
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    interpolation: {
      escapeValue: false,
    },
  })
  .catch((error: Error) => {
    console.error('Failed to initialize i18n:', error);
  });

export default i18n;
