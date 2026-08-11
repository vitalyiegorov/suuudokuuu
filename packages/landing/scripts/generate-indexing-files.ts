import { mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { isNotEmptyString } from '@rnw-community/shared';

import { INDEXNOW_KEY_ENVIRONMENT_VARIABLE, LLMS_FILE_NAME } from '../src/indexing/constants/indexnow.constant';
import { buildIndexNowKeyFileName } from '../src/indexing/utils/build-indexnow-key-file-name.util';
import { buildLlmsTxt } from '../src/indexing/utils/build-llms-txt.util';
import { resolveIndexNowKey } from '../src/indexing/utils/resolve-indexnow-key.util';

const PUBLIC_DIRECTORY = join(process.cwd(), 'public');

const isRootTextFile = (fileName: string): boolean => fileName.endsWith('.txt') && statSync(join(PUBLIC_DIRECTORY, fileName)).isFile();

const removeStaleRootTextFiles = (keptFileNames: string[]): void => {
    readdirSync(PUBLIC_DIRECTORY)
        .filter(fileName => isRootTextFile(fileName) && !keptFileNames.includes(fileName))
        .forEach(fileName => {
            rmSync(join(PUBLIC_DIRECTORY, fileName));
            console.log(`Removed stale public/${fileName}`);
        });
};

mkdirSync(PUBLIC_DIRECTORY, { recursive: true });

const indexNowKey = resolveIndexNowKey();
const hasIndexNowKey = isNotEmptyString(indexNowKey);
const keyFileName = hasIndexNowKey ? buildIndexNowKeyFileName(indexNowKey) : '';

removeStaleRootTextFiles([LLMS_FILE_NAME, ...(hasIndexNowKey ? [keyFileName] : [])]);

writeFileSync(join(PUBLIC_DIRECTORY, LLMS_FILE_NAME), buildLlmsTxt(), 'utf8');
console.log(`Wrote public/${LLMS_FILE_NAME}`);

if (hasIndexNowKey) {
    writeFileSync(join(PUBLIC_DIRECTORY, keyFileName), indexNowKey, 'utf8');
    console.log(`Wrote public/${keyFileName} (IndexNow key file, exact plaintext, no trailing newline)`);
} else {
    console.log(
        `${INDEXNOW_KEY_ENVIRONMENT_VARIABLE} is not set, skipping the IndexNow key file. This is expected for forks, contributors and preview builds; see packages/landing/docs/indexing.md.`
    );
}
