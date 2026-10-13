import { isNotEmptyArray } from '@rnw-community/shared';

import { SITE_DESCRIPTION, SITE_NAME, SITE_ORIGIN } from '../../seo/constants/site.constant';

import { buildIndexablePages } from './build-indexable-pages.util';

enum LlmsSectionEnum {
    START_HERE = 'Start here',
    DIFFICULTY = 'Sudoku by difficulty',
    GUIDES = 'Difficulty research and guides',
    PRINTABLE = 'Printable Sudoku',
    TECHNIQUES = 'Solving techniques',
    MORE = 'More pages'
}

const LLMS_SECTION_ORDER: readonly string[] = [
    LlmsSectionEnum.START_HERE,
    LlmsSectionEnum.DIFFICULTY,
    LlmsSectionEnum.GUIDES,
    LlmsSectionEnum.PRINTABLE,
    LlmsSectionEnum.TECHNIQUES,
    LlmsSectionEnum.MORE
];

const LLMS_START_HERE_PATHS = ['/', '/how-to-play', '/solver', '/glossary'];

const LLMS_GUIDE_PATHS = ['/hardest-sudoku-puzzles', '/17-clue-sudoku'];

const resolveLlmsSection = (path: string): string => {
    if (path.startsWith('/techniques')) {
        return LlmsSectionEnum.TECHNIQUES;
    }

    if (path.startsWith('/printable') || path === '/large-print-sudoku') {
        return LlmsSectionEnum.PRINTABLE;
    }

    if (path.startsWith('/guides/') || LLMS_GUIDE_PATHS.includes(path)) {
        return LlmsSectionEnum.GUIDES;
    }

    if (path === '/sudoku' || path.startsWith('/sudoku/')) {
        return LlmsSectionEnum.DIFFICULTY;
    }

    if (LLMS_START_HERE_PATHS.includes(path)) {
        return LlmsSectionEnum.START_HERE;
    }

    return LlmsSectionEnum.MORE;
};

const LLMS_INTRO = [
    `${SITE_NAME} is a free, ad-free Sudoku game and an open reference for how Sudoku is actually solved.`,
    'Every page listed below provides its main content as static HTML readable without JavaScript, with schema.org structured data, a definition-first opening sentence, and visible publication and modification dates. Optional interactive controls use JavaScript.',
    'Numbers quoted on the site — clue counts, technique frequencies, difficulty tiers, printable page counts — are produced at build time by the open-source solver that ships with the game, not written by hand.',
    `The machine-readable URL set is ${SITE_ORIGIN}/sitemap.xml and it lists exactly the pages below.`
].join(' ');

const buildSectionLines = (section: string): string[] =>
    buildIndexablePages()
        .filter(({ pageMetadata }) => resolveLlmsSection(pageMetadata.path) === section)
        .map(({ url, pageMetadata }) => `- [${pageMetadata.title}](${url}): ${pageMetadata.metaDescription}`);

export const buildLlmsTxt = (): string => {
    const sections = LLMS_SECTION_ORDER.map(section => ({ section, lines: buildSectionLines(section) })).filter(({ lines }) =>
        isNotEmptyArray(lines)
    );

    const body = sections.flatMap(({ section, lines }) => [`## ${section}`, '', ...lines, '']);

    return [`# ${SITE_NAME}`, '', `> ${SITE_DESCRIPTION}`, '', LLMS_INTRO, '', ...body].join('\n');
};
