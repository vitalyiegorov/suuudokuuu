import { isNotEmptyArray } from '@rnw-community/shared';

import { SITE_DESCRIPTION, SITE_NAME, SITE_ORIGIN } from '../../seo/constants/site.constant';
import { LLMS_SECTION_ORDER } from '../constants/llms-section.constant';

import { buildIndexablePages } from './build-indexable-pages.util';
import { resolveLlmsSection } from './resolve-llms-section.util';

const LLMS_INTRO = [
    `${SITE_NAME} is a free, ad-free Sudoku game and an open reference for how Sudoku is actually solved.`,
    'Every page listed below is a static, JavaScript-free HTML document with schema.org structured data, a definition-first opening sentence, and visible publication and modification dates.',
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
