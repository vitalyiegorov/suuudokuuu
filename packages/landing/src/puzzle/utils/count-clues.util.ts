const NON_CLUE_PATTERN = /[^1-9]/gu;

export const countClues = (puzzle: string): number => puzzle.replaceAll(NON_CLUE_PATTERN, '').length;
