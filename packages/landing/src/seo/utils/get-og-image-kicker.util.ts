import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { SITE_NAME } from '../constants/site.constant';

const OG_IMAGE_TOP_LEVEL_KICKER: Record<string, string> = {
    '': SITE_NAME,
    'why-suuudokuuu': 'Open Source',
    techniques: 'Techniques',
    sudoku: 'Difficulty Levels',
    printable: 'Printable Sudoku',
    guides: 'Guide',
    solver: 'Sudoku Solver',
    glossary: 'Glossary',
    'how-to-play': 'How to Play',
    'hardest-sudoku-puzzles': 'Hardest Puzzles',
    '17-clue-sudoku': 'Minimal Clues'
};

const OG_IMAGE_CHILD_KICKER: Record<string, string> = {
    techniques: 'Technique',
    sudoku: 'Sudoku',
    printable: 'Printable Sudoku'
};

export const getOgImageKicker = (path: string): string => {
    const segments = path.split('/').filter(isNotEmptyString);
    const topSegment = segments[0] ?? '';
    const hasChildSegment = segments.length > 1;
    const childKicker = OG_IMAGE_CHILD_KICKER[topSegment];

    if (hasChildSegment && isDefined(childKicker)) {
        return childKicker;
    }

    return OG_IMAGE_TOP_LEVEL_KICKER[topSegment] ?? SITE_NAME;
};
