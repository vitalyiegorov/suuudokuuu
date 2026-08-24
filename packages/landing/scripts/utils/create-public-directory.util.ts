import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

export const createPublicDirectory = (...segments: string[]): string => {
    const directoryPath = join(process.cwd(), 'public', ...segments);

    mkdirSync(directoryPath, { recursive: true });

    return directoryPath;
};
