'use client';

import { en } from '@/shared/i18n/messages/en';
import { ru } from '@/shared/i18n/messages/ru';

export const translate = (language?: string) => {
  switch (language) {
    case 'ru':
      return ru;
    default:
      return en;
  }
};
