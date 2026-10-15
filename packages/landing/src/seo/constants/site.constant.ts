import type { LocaleType } from '../types/locale.type';
import type { Viewport } from 'next';

export const SITE_NAME = 'Suuudokuuu';

export const SITE_ORIGIN = 'https://www.suuudokuuu.com';

export const SITE_PLAY_URL = `${SITE_ORIGIN}/play`;

export const SITE_PRIVACY_URL = `${SITE_ORIGIN}/privacy-policy`;

export const SITE_GITHUB_URL = 'https://github.com/vitalyiegorov/suuudokuuu';

export const SITE_LICENSE = 'MIT';

export const SITE_APP_STORE_ID = '6449440933';

export const SITE_APP_STORE_PROVIDER_TOKEN = '126397444';

export const SITE_APP_STORE_URL = `https://apps.apple.com/app/id${SITE_APP_STORE_ID}`;

export const SITE_GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.vitaliiyehorov.suuudokuuu';

export const SITE_TAGLINE = 'Free offline Sudoku for iOS, Android and the web';

export const SITE_DESCRIPTION =
    'Suuudokuuu is a free, ad-free Sudoku game that works offline. Seven difficulty levels, technique-aware hints, streaks and shareable puzzles.';

export const SITE_THEME_COLOR = '#000000';

export const SITE_BACKGROUND_COLOR = '#000000';

export const SITE_VIEWPORT: Viewport = {
    themeColor: SITE_THEME_COLOR,
    colorScheme: 'dark'
};

export const DEFAULT_LOCALE = 'en';

export const SUPPORTED_LOCALES = [DEFAULT_LOCALE, 'ar', 'bn', 'de', 'es', 'fr', 'hi', 'id', 'pt-BR', 'sv', 'uk', 'ur', 'zh'] as const;

export const LOCALE_NAMES: Readonly<Record<LocaleType, string>> = {
    en: 'English',
    ar: 'العربية',
    bn: 'বাংলা',
    de: 'Deutsch',
    es: 'Español',
    fr: 'Français',
    hi: 'हिन्दी',
    id: 'Bahasa Indonesia',
    'pt-BR': 'Português (Brasil)',
    sv: 'Svenska',
    uk: 'Українська',
    ur: 'اردو',
    zh: '简体中文'
};

export const RIGHT_TO_LEFT_LOCALES: readonly string[] = ['ar', 'ur'];

export const HREFLANG_DEFAULT_KEY = 'x-default';
