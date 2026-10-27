import { readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, join } from 'node:path';

import { GlobalFonts } from '@napi-rs/canvas';

const SYSTEM_FONT_DIRECTORY = '/usr/share/fonts';
const DIGIT_FONT_FILE_PATTERN =
    /^(?:Adwaita|C059|Nimbus|P052|URW|Liberation|NotoSans-|NotoSansMono|NotoSerif|iAWriter|JetBrainsMono|Inter_).*\.(?:ttf|otf)$/u;
const EXTREME_WEIGHT_FONT_FILE_PATTERN = /Thin|ExtraLight|ExtraBold|Black/u;
const HELD_OUT_EVERY = 5;

interface DigitFontsInterface {
    readonly trainingFamilies: readonly string[];
    readonly heldOutFamilies: readonly string[];
}

const listFontFiles = (directory: string): string[] =>
    readdirSync(directory, { recursive: true, encoding: 'utf8' })
        .map(relativePath => join(directory, relativePath))
        .filter(path => DIGIT_FONT_FILE_PATTERN.test(basename(path)) && !EXTREME_WEIGHT_FONT_FILE_PATTERN.test(basename(path)));

export const registerDigitFonts = (): DigitFontsInterface => {
    const interDirectory = dirname(createRequire(import.meta.url).resolve('@expo-google-fonts/inter/package.json'));
    const families = [...listFontFiles(SYSTEM_FONT_DIRECTORY), ...listFontFiles(interDirectory)].sort().map(path => {
        const family = basename(path).replace(/\.\w+$/u, '');

        GlobalFonts.registerFromPath(path, family);

        return family;
    });

    return {
        trainingFamilies: families.filter((_, index) => index % HELD_OUT_EVERY !== 0),
        heldOutFamilies: families.filter((_, index) => index % HELD_OUT_EVERY === 0)
    };
};
