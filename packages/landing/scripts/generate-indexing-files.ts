import { readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { INDEXNOW_KEY_ENVIRONMENT_VARIABLE, LLMS_FILE_NAME } from '../src/indexing/constants/indexnow.constant';
import { buildIndexNowKeyFileName } from '../src/indexing/utils/build-indexnow-key-file-name.util';
import { buildLlmsTxt } from '../src/indexing/utils/build-llms-txt.util';
import { resolveIndexNowKey } from '../src/indexing/utils/resolve-indexnow-key.util';

import { createPublicDirectory } from './utils/create-public-directory.util';
import { writePublicArtifact } from './utils/write-public-artifact.util';

const PUBLIC_DIRECTORY = createPublicDirectory();

const removeStaleRootTextFiles = (keptFileNames: string[]): void => {
    readdirSync(PUBLIC_DIRECTORY)
        .filter(fileName => fileName.endsWith('.txt') && !keptFileNames.includes(fileName))
        .forEach(fileName => {
            rmSync(join(PUBLIC_DIRECTORY, fileName));
            console.log(`Removed stale public/${fileName}`);
        });
};

const indexNowKey = resolveIndexNowKey();
const keyFileName = isNotEmptyString(indexNowKey) ? buildIndexNowKeyFileName(indexNowKey) : undefined;

removeStaleRootTextFiles([LLMS_FILE_NAME, ...(isDefined(keyFileName) ? [keyFileName] : [])]);

writePublicArtifact(PUBLIC_DIRECTORY, LLMS_FILE_NAME, buildLlmsTxt());
console.log(`Wrote public/${LLMS_FILE_NAME}`);

if (isDefined(keyFileName)) {
    writePublicArtifact(PUBLIC_DIRECTORY, keyFileName, indexNowKey);
    console.log(`Wrote public/${keyFileName} (IndexNow key file, exact plaintext, no trailing newline)`);
} else {
    console.log(
        `${INDEXNOW_KEY_ENVIRONMENT_VARIABLE} is not set, skipping the IndexNow key file. This is expected for forks, contributors and preview builds; see packages/landing/docs/indexing.md.`
    );
}
