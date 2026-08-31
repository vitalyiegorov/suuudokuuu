export const LLMS_SECTIONS = {
    startHere: 'Start here',
    difficulty: 'Sudoku by difficulty',
    guides: 'Difficulty research and guides',
    printable: 'Printable Sudoku',
    techniques: 'Solving techniques',
    more: 'More pages'
} as const;

export const LLMS_SECTION_ORDER: string[] = [
    LLMS_SECTIONS.startHere,
    LLMS_SECTIONS.difficulty,
    LLMS_SECTIONS.guides,
    LLMS_SECTIONS.printable,
    LLMS_SECTIONS.techniques,
    LLMS_SECTIONS.more
];

export const LLMS_START_HERE_PATHS = ['/', '/how-to-play', '/solver', '/glossary'];

export const LLMS_GUIDE_PATHS = ['/hardest-sudoku-puzzles', '/17-clue-sudoku'];
