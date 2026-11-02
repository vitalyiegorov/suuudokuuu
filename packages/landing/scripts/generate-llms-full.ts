import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { isNotEmptyString } from '@rnw-community/shared';

import { SITE_NAME } from '../src/seo/constants/site.constant';

import { readMainText } from './utils/read-main-text.util';

const EXPORT_DIRECTORY = join(import.meta.dirname, '..', 'out');
const lines = [
    `# ${SITE_NAME}`,
    '',
    'Full text of the English pages listed in llms.txt, in the same section and page order, extracted from the static HTML export.',
    ''
];

for (const [, title = '', url = ''] of readFileSync(join(EXPORT_DIRECTORY, 'llms.txt'), 'utf8').matchAll(
    /^- \[([^\]]+)\]\((https:\/\/[^)\s]+)\):/gmu
)) {
    const { pathname } = new URL(url);
    const file = pathname === '/' ? 'index.html' : `${pathname.slice(1)}.html`;
    const text = readMainText(readFileSync(join(EXPORT_DIRECTORY, file), 'utf8'));
    if (!isNotEmptyString(text)) {
        throw new Error(`${file} has no <main> text`);
    }
    lines.push(`## ${title}`, `URL: ${url}`, '', text, '');
}

writeFileSync(join(EXPORT_DIRECTORY, 'llms-full.txt'), lines.join('\n'));
