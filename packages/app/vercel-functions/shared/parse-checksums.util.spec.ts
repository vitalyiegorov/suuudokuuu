import { describe, expect, it } from '@jest/globals';

import { MaximumChecksumsByteLength } from './beta-release.constant';
import { parseChecksums } from './parse-checksums.util';

const ChecksumLength = 64;
const IpaChecksum = 'a'.repeat(ChecksumLength);
const ApkChecksum = 'b'.repeat(ChecksumLength);
const ValidChecksums = `${IpaChecksum}  suuudokuuu-development.ipa\n${ApkChecksum}  suuudokuuu-development.apk\n`;

describe('parseChecksums', () => {
    it('parses the canonical IPA then APK checksum file', () => {
        expect(parseChecksums(ValidChecksums)).toEqual({ apk: ApkChecksum, ipa: IpaChecksum });
    });

    it.each([
        `${ApkChecksum}  suuudokuuu-development.apk\n${IpaChecksum}  suuudokuuu-development.ipa\n`,
        ValidChecksums.replace('.ipa', '.IPA'),
        ValidChecksums.replace('  suuudokuuu-development.ipa', ' suuudokuuu-development.ipa'),
        ValidChecksums.replace('  suuudokuuu-development.ipa', ' *suuudokuuu-development.ipa'),
        ValidChecksums.replace('suuudokuuu-development.ipa', '../suuudokuuu-development.ipa'),
        ValidChecksums.replace(IpaChecksum, IpaChecksum.toUpperCase()),
        ValidChecksums.trimEnd(),
        `${ValidChecksums}extra`,
        `${IpaChecksum}  suuudokuuu-development.ipa\n`,
        `${ValidChecksums}${IpaChecksum}  another.ipa\n`,
        `${ValidChecksums}${'ü'.repeat(MaximumChecksumsByteLength)}`
    ])('rejects non-canonical or oversized checksum content', checksums => {
        expect(parseChecksums(checksums)).toBeNull();
    });
});
