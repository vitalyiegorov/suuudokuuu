import { MaximumChecksumsByteLength } from './beta-release.constant';

import type { ReleaseChecksums } from './beta-release.interface';

const ChecksumsPattern = /^([a-f0-9]{64}) {2}suuudokuuu-development\.ipa\n([a-f0-9]{64}) {2}suuudokuuu-development\.apk\n$/u;

export const parseChecksums = (checksums: string): ReleaseChecksums | null => {
    const checksumsByteLength = new TextEncoder().encode(checksums).byteLength;
    if (checksumsByteLength > MaximumChecksumsByteLength) {
        return null;
    }

    const checksumsMatch = ChecksumsPattern.exec(checksums);
    const ipa = checksumsMatch?.at(1) ?? null;
    const apk = checksumsMatch?.at(2) ?? null;
    if (ipa === null || apk === null) {
        return null;
    }

    return { apk, ipa };
};
