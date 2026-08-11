import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';
import { createElement } from 'react';

import {
    OG_IMAGE_ACCENT_COLOR,
    OG_IMAGE_BACKGROUND_COLOR,
    OG_IMAGE_BORDER_COLOR,
    OG_IMAGE_GRID_LINE_COLOR,
    OG_IMAGE_HEIGHT,
    OG_IMAGE_MUTED_COLOR,
    OG_IMAGE_TEXT_COLOR,
    OG_IMAGE_WIDTH
} from '../src/seo/constants/og-image.constant';
import { SITE_NAME, SITE_TAGLINE } from '../src/seo/constants/site.constant';
import { PAGE_METADATA_REGISTRY } from '../src/seo/registries/page-metadata.registry';
import { getOgImageKicker } from '../src/seo/utils/get-og-image-kicker.util';
import { getOgImageSlug } from '../src/seo/utils/get-og-image-path.util';

import type { ReactElement } from 'react';

type OgImageResponseOptions = NonNullable<ConstructorParameters<typeof ImageResponse>[1]>;

const OUTPUT_DIRECTORY = join(process.cwd(), 'public', 'og');
const OG_IMAGE_FONT_FAMILY = 'Inter';
const OG_IMAGE_FONT_WEIGHT_REGULAR = 400;
const OG_IMAGE_FONT_WEIGHT_SEMIBOLD = 600;
const OG_IMAGE_FONT_WEIGHT_BOLD = 700;
const OG_IMAGE_FONTS: OgImageResponseOptions['fonts'] = [
    {
        name: OG_IMAGE_FONT_FAMILY,
        data: readFileSync(require.resolve('@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf')),
        style: 'normal',
        weight: OG_IMAGE_FONT_WEIGHT_REGULAR
    },
    {
        name: OG_IMAGE_FONT_FAMILY,
        data: readFileSync(require.resolve('@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf')),
        style: 'normal',
        weight: OG_IMAGE_FONT_WEIGHT_SEMIBOLD
    },
    {
        name: OG_IMAGE_FONT_FAMILY,
        data: readFileSync(require.resolve('@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf')),
        style: 'normal',
        weight: OG_IMAGE_FONT_WEIGHT_BOLD
    }
];
const GRID_MOTIF_PATTERN =
    '.4...8..6' + '6..3..1..' + '..1.6.4..' + '.......7.' + '2.6...9.4' + '.5.......' + '..7.9.2..' + '..8..5..1' + '3..1...8.';
const GRID_MOTIF_SIZE = 9;
const GRID_MOTIF_BOX_SIZE = 3;
const GRID_MOTIF_CELL_PIXELS = 24;
const GRID_MOTIF_THIN_BORDER = `1px solid ${OG_IMAGE_GRID_LINE_COLOR}`;
const GRID_MOTIF_THICK_BORDER = `2px solid ${OG_IMAGE_ACCENT_COLOR}`;
const TITLE_FONT_SIZE_SHORT = 68;
const TITLE_FONT_SIZE_MEDIUM = 56;
const TITLE_FONT_SIZE_LONG = 46;
const TITLE_SHORT_LENGTH = 28;
const TITLE_MEDIUM_LENGTH = 46;
const OG_IMAGE_PADDING = 64;
const OG_IMAGE_MAIN_ROW_GAP = 48;
const OG_IMAGE_MOTIF_WIDTH = GRID_MOTIF_SIZE * GRID_MOTIF_CELL_PIXELS + 4;
const OG_IMAGE_COPY_WIDTH = OG_IMAGE_WIDTH - OG_IMAGE_PADDING * 2 - OG_IMAGE_MOTIF_WIDTH - OG_IMAGE_MAIN_ROW_GAP;

const getTitleFontSize = (title: string): number => {
    if (title.length <= TITLE_SHORT_LENGTH) {
        return TITLE_FONT_SIZE_SHORT;
    }

    if (title.length <= TITLE_MEDIUM_LENGTH) {
        return TITLE_FONT_SIZE_MEDIUM;
    }

    return TITLE_FONT_SIZE_LONG;
};

const buildGridMotifCell = (isFilled: boolean, columnIndex: number, rowIndex: number): ReactElement => {
    const isRightBoxEdge = (columnIndex + 1) % GRID_MOTIF_BOX_SIZE === 0 && columnIndex !== GRID_MOTIF_SIZE - 1;
    const isBottomBoxEdge = (rowIndex + 1) % GRID_MOTIF_BOX_SIZE === 0 && rowIndex !== GRID_MOTIF_SIZE - 1;

    return createElement('div', {
        key: `${rowIndex}-${columnIndex}`,
        style: {
            width: GRID_MOTIF_CELL_PIXELS,
            height: GRID_MOTIF_CELL_PIXELS,
            display: 'flex',
            background: isFilled ? OG_IMAGE_ACCENT_COLOR : 'transparent',
            opacity: isFilled ? 0.85 : 1,
            borderRight: isRightBoxEdge ? GRID_MOTIF_THICK_BORDER : GRID_MOTIF_THIN_BORDER,
            borderBottom: isBottomBoxEdge ? GRID_MOTIF_THICK_BORDER : GRID_MOTIF_THIN_BORDER
        }
    });
};

const buildGridMotifRow = (rowIndex: number): ReactElement => {
    const rowStart = rowIndex * GRID_MOTIF_SIZE;
    const rowPattern = GRID_MOTIF_PATTERN.slice(rowStart, rowStart + GRID_MOTIF_SIZE);
    const cells = rowPattern.split('').map((cellValue, columnIndex) => buildGridMotifCell(cellValue !== '.', columnIndex, rowIndex));

    return createElement('div', { key: rowIndex, style: { display: 'flex', flexDirection: 'row' } }, cells);
};

const buildGridMotif = (): ReactElement => {
    const rows = Array.from({ length: GRID_MOTIF_SIZE }, (_rowValue, rowIndex) => buildGridMotifRow(rowIndex));

    return createElement(
        'div',
        {
            style: {
                display: 'flex',
                flexDirection: 'column',
                border: GRID_MOTIF_THICK_BORDER,
                borderRadius: 12
            }
        },
        rows
    );
};

const buildKicker = (kicker: string): ReactElement =>
    createElement(
        'div',
        {
            style: {
                display: 'flex',
                alignSelf: 'flex-start',
                color: OG_IMAGE_ACCENT_COLOR,
                fontSize: 28,
                fontWeight: OG_IMAGE_FONT_WEIGHT_SEMIBOLD,
                letterSpacing: 2,
                textTransform: 'uppercase',
                border: `1px solid ${OG_IMAGE_ACCENT_COLOR}`,
                borderRadius: 999,
                padding: '10px 24px'
            }
        },
        kicker
    );

const buildTitle = (title: string): ReactElement =>
    createElement(
        'div',
        {
            style: {
                display: 'flex',
                width: OG_IMAGE_COPY_WIDTH,
                color: OG_IMAGE_TEXT_COLOR,
                fontSize: getTitleFontSize(title),
                fontWeight: OG_IMAGE_FONT_WEIGHT_BOLD,
                lineHeight: 1.15
            }
        },
        title
    );

const buildFooter = (): ReactElement =>
    createElement(
        'div',
        {
            style: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: `1px solid ${OG_IMAGE_BORDER_COLOR}`,
                paddingTop: 32
            }
        },
        [
            createElement(
                'div',
                {
                    key: 'name',
                    style: { display: 'flex', color: OG_IMAGE_TEXT_COLOR, fontSize: 32, fontWeight: OG_IMAGE_FONT_WEIGHT_BOLD }
                },
                SITE_NAME
            ),
            createElement(
                'div',
                {
                    key: 'tagline',
                    style: { display: 'flex', color: OG_IMAGE_MUTED_COLOR, fontSize: 24, fontWeight: OG_IMAGE_FONT_WEIGHT_REGULAR }
                },
                SITE_TAGLINE
            )
        ]
    );

const buildOgImageElement = (kicker: string, title: string): ReactElement =>
    createElement(
        'div',
        {
            style: {
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: OG_IMAGE_BACKGROUND_COLOR,
                padding: OG_IMAGE_PADDING,
                fontFamily: OG_IMAGE_FONT_FAMILY
            }
        },
        [
            createElement(
                'div',
                {
                    key: 'main',
                    style: { display: 'flex', flexDirection: 'row', flexGrow: 1, alignItems: 'center', gap: OG_IMAGE_MAIN_ROW_GAP }
                },
                [
                    createElement(
                        'div',
                        {
                            key: 'copy',
                            style: { display: 'flex', flexDirection: 'column', width: OG_IMAGE_COPY_WIDTH, gap: 28 }
                        },
                        [buildKicker(kicker), buildTitle(title)]
                    ),
                    createElement('div', { key: 'motif', style: { display: 'flex', flexShrink: 0 } }, buildGridMotif())
                ]
            ),
            buildFooter()
        ]
    );

const renderOgImage = async (kicker: string, title: string): Promise<Buffer> => {
    const response = new ImageResponse(buildOgImageElement(kicker, title), {
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        fonts: OG_IMAGE_FONTS
    });

    return Buffer.from(await response.arrayBuffer());
};

const generateOgImages = async (): Promise<void> => {
    mkdirSync(OUTPUT_DIRECTORY, { recursive: true });

    for (const pageMetadata of PAGE_METADATA_REGISTRY) {
        const kicker = getOgImageKicker(pageMetadata.path);
        const buffer = await renderOgImage(kicker, pageMetadata.title);
        const fileName = `${getOgImageSlug(pageMetadata.path)}.png`;

        writeFileSync(join(OUTPUT_DIRECTORY, fileName), buffer);
    }

    console.log(`Generated ${PAGE_METADATA_REGISTRY.length} OG images in ${OUTPUT_DIRECTORY}`);
};

generateOgImages().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
