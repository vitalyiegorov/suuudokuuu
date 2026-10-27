import { createCanvas, loadImage } from '@napi-rs/canvas';

import { registerDigitFonts } from './shared/register-digit-fonts';
import { photographCanvas, renderFlatGrid } from './shared/render-synthetic-photo';
import { SeededRandom } from './shared/seeded-random';
import { FIXTURE_DIRECTORY, readFixtureManifest, writeFixture } from './shared/write-fixture';

const FIXTURE_SEED = 2606;
const PRINTED_PHOTO_COUNT = 24;
const NO_GRID_PHOTO_COUNT = 4;
const NO_GRID = 'none';
const CLUE_PROBABILITY = { minimum: 0.27, maximum: 0.45 };
const PRINTED_JPEG_QUALITY = { minimum: 45, maximum: 85 };
const SCREEN_JPEG_QUALITY = { minimum: 55, maximum: 85 };
const NO_GRID_JPEG_QUALITY = 70;
const SCREEN_BOARD_CROP = { top: 100, height: 500 };
const TEXT_PAGE_SIZE = { minimum: 300, maximum: 500 };
const TEXT_FONT_SIZE = { minimum: 10, maximum: 18 };
const TEXT_LINE_HEIGHT = 20;
const TEXT_INDENT = { minimum: -40, maximum: 10 };
const TEXT_BASELINE = 15;

const random = new SeededRandom(FIXTURE_SEED);
const fonts = registerDigitFonts();
const fixtureNumber = (index: number): string => String(index + 1).padStart(2, '0');

for (let photo = 0; photo < PRINTED_PHOTO_COUNT; photo += 1) {
    const puzzle = random.puzzle(random.between(CLUE_PROBABILITY));
    const canvas = photographCanvas(random, renderFlatGrid(random, puzzle, random.pick(fonts.heldOutFamilies)));

    writeFixture(`printed-photo-${fixtureNumber(photo)}.jpg`, canvas.encodeSync('jpeg', random.integer(PRINTED_JPEG_QUALITY)), puzzle);
}

for (const [file, expected] of readFixtureManifest()) {
    if (file.startsWith('app-') && file.endsWith('-light-390.jpg')) {
        const screenshot = await loadImage(new URL(file, FIXTURE_DIRECTORY));
        const flat = createCanvas(screenshot.width, SCREEN_BOARD_CROP.height);

        flat.getContext('2d').drawImage(screenshot, 0, -SCREEN_BOARD_CROP.top);
        writeFixture(
            `screen-photo-${file.replaceAll(/^app-|-light-390/gu, '')}`,
            photographCanvas(random, flat).encodeSync('jpeg', random.integer(SCREEN_JPEG_QUALITY)),
            expected
        );
    }
}

for (let photo = 0; photo < NO_GRID_PHOTO_COUNT; photo += 1) {
    const page = createCanvas(random.integer(TEXT_PAGE_SIZE), random.integer(TEXT_PAGE_SIZE));
    const context = page.getContext('2d');

    context.fillStyle = 'rgb(240, 236, 228)';
    context.fillRect(0, 0, page.width, page.height);
    context.fillStyle = 'rgb(30, 30, 30)';

    for (let line = 0; line < page.height / TEXT_LINE_HEIGHT; line += 1) {
        context.font = `${random.integer(TEXT_FONT_SIZE)}px "${random.pick(fonts.heldOutFamilies)}"`;
        context.fillText(
            'Crossword 12 across: 3 down 7 letters, news 2026 page 14',
            random.between(TEXT_INDENT),
            line * TEXT_LINE_HEIGHT + TEXT_BASELINE
        );
    }

    writeFixture(`no-grid-${fixtureNumber(photo)}.jpg`, photographCanvas(random, page).encodeSync('jpeg', NO_GRID_JPEG_QUALITY), NO_GRID);
}
