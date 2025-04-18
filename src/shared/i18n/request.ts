import { getRequestConfig } from 'next-intl/server';
import { Locale, routing } from './routing';

const messages = {
  en: {},
  ru: {},
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: messages,
  };
});
