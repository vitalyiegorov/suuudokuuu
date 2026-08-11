import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export const writeGeneratedCorpusModule = ({ outputFile, header, sizeName, size, base64Name, base64 }) => {
    const fileContents = [header, `export const ${sizeName} = ${size};`, '', `export const ${base64Name} = '${base64}';`, ''].join('\n');

    mkdirSync(dirname(outputFile), { recursive: true });
    writeFileSync(outputFile, fileContents, 'utf8');
};
