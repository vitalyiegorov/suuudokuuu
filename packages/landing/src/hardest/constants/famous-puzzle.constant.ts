import type { FamousPuzzleInterface } from '../interfaces/famous-puzzle.interface';

export const AI_ESCARGOT: FamousPuzzleInterface = {
    name: 'AI Escargot',
    fileName: 'ai-escargot',
    givens: '100007090030020008009600500005300900010080002600004000300000010040000007007000300'
};

export const EASTER_MONSTER: FamousPuzzleInterface = {
    name: 'Easter Monster',
    fileName: 'easter-monster',
    givens: '100000002090400050006000700050903000000070000000850040700000600030009080002000001'
};

export const GOLDEN_NUGGET: FamousPuzzleInterface = {
    name: 'Golden Nugget',
    fileName: 'golden-nugget',
    givens: '000000039000001005003050800008090006070002000100400000009080050020000600400700000'
};

export const PLATINUM_BLONDE: FamousPuzzleInterface = {
    name: 'Platinum Blonde',
    fileName: 'platinum-blonde',
    givens: '000000012000000003002300400001800005060070800000009000008500000900040500470006000'
};

export const EVEREST: FamousPuzzleInterface = {
    name: 'Everest',
    fileName: 'everest',
    givens: '800000000003600000070090200050007000000045700000100030001000068008500010090000400'
};

export const KOLK: FamousPuzzleInterface = {
    name: 'Kolk',
    fileName: 'kolk',
    givens: '120300000400000300003050000004200500000080009060005070001500200000090060000007008'
};

export const SILVER_PLATE: FamousPuzzleInterface = {
    name: 'Silver Plate',
    fileName: 'silver-plate',
    givens: '100000007020400060003000500090040000000062040000900800005000003060200080700001000'
};

export const FAMOUS_PUZZLES: readonly FamousPuzzleInterface[] = [
    AI_ESCARGOT,
    EASTER_MONSTER,
    GOLDEN_NUGGET,
    PLATINUM_BLONDE,
    EVEREST,
    KOLK,
    SILVER_PLATE
];
