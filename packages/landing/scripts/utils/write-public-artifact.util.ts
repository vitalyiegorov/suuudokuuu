import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const writePublicArtifact = (directoryPath: string, fileName: string, contents: string | Uint8Array): void => {
    writeFileSync(join(directoryPath, fileName), contents);
};
