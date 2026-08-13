export const locales = ['vi', 'en', 'ja'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'vi';

export type MessageKey = 'home.title' | 'home.intro';

export type Messages = Record<MessageKey, string>;

export const messages: Record<Locale, Messages> = {
  vi: {
    'home.title': 'Cham Nhat Ban - Web (App Router)',
    'home.intro': 'Chao mung. Day la web app scaffold.',
  },
  en: {
    'home.title': 'Cham Nhat Ban - Web (App Router)',
    'home.intro': 'Welcome. This is the scaffolded web app.',
  },
  ja: {
    'home.title': 'Cham Nhat Ban - Web (App Router)',
    'home.intro': 'Welcome. This is the scaffolded web app.',
  },
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}

export function translate(locale: Locale, key: MessageKey): string {
  return messages[locale][key];
}
