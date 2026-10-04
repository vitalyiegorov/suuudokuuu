import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { getHellCorpusRecord, getInfinityCorpusPuzzle, hellCorpusSize } from '@suuudokuuu/hell-corpus';
import { createSeededRandom } from '@suuudokuuu/solver-core';
import { describe, expect, it } from 'vitest';

import { FieldEngine } from '../../src/field-engine/classes/field-engine';
import { findHintStepScript } from '../../src/step-script/utils/find-hint-step-script.util';

import type { CellInterface } from '@suuudokuuu/generator';

type NoteModeType = 'no notes' | 'pencil notes' | 'auto candidates';

const noteModes: NoteModeType[] = ['pencil notes', 'auto candidates'];
const generatedDifficulties = [DifficultyEnum.Newbie, DifficultyEnum.Easy, DifficultyEnum.Medium, DifficultyEnum.Hard];
const generatedSeeds = [1, 2, 3];
const nightmareSeeds = [1, 2];
const hellCorpusStride = 40;
const hardestHellCount = 10;
const infinityCorpusCount = 10;
const corpusTimeoutMilliseconds = 60000;

const generatePuzzle = (difficulty: DifficultyEnum, seed: number): string => {
    const sudoku = new Sudoku({ ...defaultSudokuConfig, random: createSeededRandom(seed) });

    sudoku.create(difficulty);

    return sudoku.toString();
};

const hellIndexes = Array.from({ length: hellCorpusSize }, (_, index) => index);
const hardestHellPuzzles = hellIndexes
    .map(index => getHellCorpusRecord(index))
    .sort((left, right) => right.rating - left.rating)
    .slice(0, hardestHellCount)
    .map(record => record.puzzle);

const generatedPuzzles: [string, string][] = [
    ...generatedDifficulties.flatMap(difficulty =>
        generatedSeeds.map((seed): [string, string] => [`${difficulty} seed ${seed}`, generatePuzzle(difficulty, seed)])
    ),
    ...nightmareSeeds.map((seed): [string, string] => [`Nightmare seed ${seed}`, generatePuzzle(DifficultyEnum.Nightmare, seed)])
];

const corpusPuzzles: [string, string][] = [
    ...hellIndexes
        .filter(index => index % hellCorpusStride === 0)
        .map((index): [string, string] => [`Hell corpus ${index}`, getHellCorpusRecord(index).puzzle]),
    ...hardestHellPuzzles.map((puzzle, rank): [string, string] => [`Hell corpus hardest ${rank}`, puzzle]),
    ...Array.from({ length: infinityCorpusCount }, (_, index): [string, string] => [
        `Infinity corpus ${index}`,
        getInfinityCorpusPuzzle(index).puzzle
    ])
];

const firstGeneratedHint = 1;
const firstCorpusHint = 0;

const cases = [
    ...generatedPuzzles.map(([label, puzzle]): [string, string, number] => [label, puzzle, firstGeneratedHint]),
    ...corpusPuzzles.map(([label, puzzle]): [string, string, number] => [label, puzzle, firstCorpusHint])
];

const getBlankCells = (engine: FieldEngine): CellInterface[] => engine.Sudoku.Field.flat().filter(cell => engine.Sudoku.isBlankCell(cell));

const createEngine = (puzzle: string, noteMode: NoteModeType): FieldEngine => {
    const engine = new FieldEngine({
        sudokuString: puzzle,
        difficulty: DifficultyEnum.Hard,
        showAutoCandidates: noteMode === 'auto candidates'
    });

    if (noteMode === 'pencil notes') {
        for (const cell of getBlankCells(engine)) {
            for (const value of engine.Sudoku.getCellCandidates(cell)) {
                engine.toggleCandidate(cell, value);
            }
        }
    }

    return engine;
};

const playHints = (puzzle: string, noteMode: NoteModeType): { outcome: string; hints: number; problems: string[] } => {
    const engine = createEngine(puzzle, noteMode);
    const problems: string[] = [];

    for (let hint = 0; hint <= puzzle.length; hint += 1) {
        const script = findHintStepScript(engine.Sudoku);

        if (engine.getSnapshot().isWon || script === null) {
            return { outcome: engine.getSnapshot().isWon ? 'solved' : 'guess', hints: hint, problems };
        }

        const blankCount = getBlankCells(engine).length;
        const { placement } = script;
        const solutionValue = engine.Sudoku.getCorrectValue(placement?.cell);
        const wrongEliminations = script.eliminations.filter(({ cell, value }) => engine.Sudoku.getCorrectValue(cell) === value);

        engine.startStepScript(script);
        engine.applyStepScript();

        const placedValue = placement ? engine.Sudoku.Field[placement.cell.y][placement.cell.x].value : 0;
        const lostSolutionNotes = getBlankCells(engine).filter(
            cell => noteMode !== 'no notes' && !engine.getCellCandidates(cell).includes(engine.Sudoku.getCorrectValue(cell))
        );

        problems.push(
            ...(placement === undefined ? [`hint ${hint} has no placement`] : []),
            ...(placedValue === solutionValue && placement?.value === solutionValue ? [] : [`hint ${hint} placed a wrong digit`]),
            ...(getBlankCells(engine).length === blankCount - 1 ? [] : [`hint ${hint} did not place exactly one digit`]),
            ...(engine.getSnapshot().mistakes === 0 ? [] : [`hint ${hint} registered a mistake`]),
            ...wrongEliminations.map(({ cell, value }) => `hint ${hint} eliminated the solution ${value} at ${cell.y}-${cell.x}`),
            ...lostSolutionNotes.map(cell => `hint ${hint} left ${cell.y}-${cell.x} without its solution candidate`)
        );
    }

    return { outcome: 'stalled', hints: puzzle.length, problems };
};

describe('hint progress over puzzle corpora', () => {
    it.each(
        cases.flatMap(([label, puzzle, minimumHints], index): [string, NoteModeType, string, number][] => [
            [label, 'no notes', puzzle, minimumHints],
            [label, noteModes[index % noteModes.length], puzzle, minimumHints]
        ])
    )(
        '%s, %s: every hint places one solution digit until solved or a guess is needed',
        (_label, noteMode, puzzle, minimumHints) => {
            expect.assertions(3);

            const { hints, outcome, problems } = playHints(puzzle, noteMode);

            expect(problems).toEqual([]);
            expect(['solved', 'guess']).toContain(outcome);
            expect(hints).toBeGreaterThanOrEqual(minimumHints);
        },
        corpusTimeoutMilliseconds
    );
});
