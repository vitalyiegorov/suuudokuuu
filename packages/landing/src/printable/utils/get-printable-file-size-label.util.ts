import { statSync } from 'node:fs';
import { join } from 'node:path';

const BYTES_PER_KILOBYTE = 1024;

export const getPrintableFileSizeLabel = (fileName: string): string => {
    const filePath = join(process.cwd(), 'public', 'printable', fileName);
    const { size } = statSync(filePath);

    return `${Math.ceil(size / BYTES_PER_KILOBYTE)} KB`;
};
