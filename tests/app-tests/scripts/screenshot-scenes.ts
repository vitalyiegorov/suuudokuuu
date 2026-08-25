export interface Scene {
    deepLink?: string;
    file: string;
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

export const AllLocales = ['en', 'uk', 'de', 'es', 'fr', 'sv', 'zh', 'hi', 'ar', 'bn', 'pt', 'id', 'ur'];
export const AllAppearances = ['light', 'dark'];
export const AllDeviceClasses = ['iphone', 'ipad'];

export const AllScenes: Scene[] = [
    { deepLink: 'suuudokuuu://game', file: '01.hero-board.flow.yaml', name: 'hero-board', sceneState: 'hero', seedDifficulty: 'Nightmare' },
    { deepLink: HomeDeepLink, file: '02.hell.flow.yaml', name: 'hell', seedDifficulty: 'Hell' },
    { deepLink: 'suuudokuuu://settings/themes', file: '03.themes.flow.yaml', name: 'themes' },
    { deepLink: 'suuudokuuu://settings/themes/editor', file: '04.editor.flow.yaml', name: 'editor' },
    { file: '05.win.flow.yaml', name: 'win' },
    { deepLink: RivalChallengeLink, file: '06.rival.flow.yaml', name: 'rival' },
    { deepLink: `suuudokuuu://history/Newbie/${SeededReplayCompletedAt}`, file: '07.replay.flow.yaml', name: 'replay' },
    { deepLink: 'suuudokuuu://settings', file: '08.settings.flow.yaml', name: 'settings' },
    { deepLink: HomeDeepLink, file: '09.home.flow.yaml', name: 'home', seedDifficulty: 'Medium' },
    { deepLink: 'suuudokuuu://history', file: '10.stats.flow.yaml', name: 'stats' },
    { file: '11.pause.flow.yaml', name: 'pause' },
    { deepLink: 'suuudokuuu://scoring', file: '12.scoring.flow.yaml', name: 'scoring' },
    { deepLink: 'suuudokuuu://history/Newbie', file: '13.history.flow.yaml', name: 'history' },
    {
        deepLink: 'suuudokuuu://game',
        file: '14.challenge-live.flow.yaml',
        name: 'challenge-live',
        sceneState: 'challengeLive',
        seedDifficulty: 'Nightmare'
    },
    {
        deepLink: 'suuudokuuu://game',
        file: '15.infinity.flow.yaml',
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

export const localeIdentifierFor = (locale: string): string =>
    Object.hasOwn(LocaleIdentifiers, locale) ? LocaleIdentifiers[locale] : DefaultLocaleIdentifier;

export const sceneScreenshotBaseName = (scene: Scene): string => {
    const [sceneNumberPrefix] = scene.file.split('.');

    return `${sceneNumberPrefix}-${scene.name}`;
};
