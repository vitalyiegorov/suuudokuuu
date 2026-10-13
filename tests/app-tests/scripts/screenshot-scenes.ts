export interface Scene {
    deepLink?: string;
    file?: string;
    name: string;
    sceneState?: string;
    seedDifficulty?: string;
}

const RivalChallengeLink =
    'suuudokuuu://shared/_KAOADKxQxGAEwAiG0eSR7tZLUwnibscwQ0-A5fIIKC45kkWcIIQQQRgYUgCGSyNYgAAAAAAAAAAAAASWSrfOcD6yrHa0SAMNhPEITYFvbWxiFMlBQUFBQUFBQUFBQUFBQUFCQkFAgICAgICBQIFCQIJCQUFCQkFAgICAgICAgICAgICAgICAgICAgICAgIA';
const SeededReplayCompletedAt = 1786911307464;
const DefaultLocaleIdentifier = 'en_US';

export const HomeDeepLink = 'suuudokuuu://';
export const DefaultSeedDifficulty = 'Hell';

export const AllAppearances = ['light', 'dark'];
export const AllDeviceClasses = ['iphone', 'ipad'];

export const AllScenes: Scene[] = [
    { deepLink: 'suuudokuuu://game', name: 'hero-board', sceneState: 'hero', seedDifficulty: 'Nightmare' },
    { deepLink: HomeDeepLink, name: 'hell', seedDifficulty: 'Hell' },
    { deepLink: 'suuudokuuu://settings/themes', name: 'themes' },
    { deepLink: 'suuudokuuu://settings/themes/editor', name: 'editor' },
    { file: '05.win.flow.yaml', name: 'win' },
    { deepLink: RivalChallengeLink, name: 'rival' },
    { deepLink: `suuudokuuu://history/Newbie/${SeededReplayCompletedAt}`, name: 'replay' },
    { deepLink: 'suuudokuuu://settings', name: 'settings' },
    { deepLink: HomeDeepLink, name: 'home', seedDifficulty: 'Medium' },
    { deepLink: 'suuudokuuu://history', name: 'stats' },
    { file: '11.pause.flow.yaml', name: 'pause' },
    { deepLink: 'suuudokuuu://scoring', name: 'scoring' },
    { deepLink: 'suuudokuuu://history/Newbie', name: 'history' },
    {
        deepLink: 'suuudokuuu://game',
        name: 'challenge-live',
        sceneState: 'challengeLive',
        seedDifficulty: 'Nightmare'
    },
    {
        deepLink: 'suuudokuuu://game',
        name: 'infinity',
        sceneState: 'infinity',
        seedDifficulty: 'Infinity'
    }
];

const LocaleIdentifiers: Record<string, string> = {
    ar: 'ar_SA',
    bn: 'bn_BD',
    de: 'de_DE',
    en: 'en_US',
    es: 'es_ES',
    fr: 'fr_FR',
    hi: 'hi_IN',
    id: 'id_ID',
    pt: 'pt_BR',
    sv: 'sv_SE',
    uk: 'uk_UA',
    ur: 'ur_PK',
    zh: 'zh_CN'
};

export const AllLocales = Object.keys(LocaleIdentifiers);

export const localeIdentifierFor = (locale: string): string =>
    Object.hasOwn(LocaleIdentifiers, locale) ? LocaleIdentifiers[locale] : DefaultLocaleIdentifier;

export const sceneScreenshotBaseName = (scene: Scene): string => {
    const sceneNumberPrefix = String(AllScenes.indexOf(scene) + 1).padStart(2, '0');

    return `${sceneNumberPrefix}-${scene.name}`;
};
