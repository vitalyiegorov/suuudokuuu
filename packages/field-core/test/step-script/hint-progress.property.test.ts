import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { getHellCorpusRecord, getInfinityCorpusPuzzle, hellCorpusSize } from '@suuudokuuu/hell-corpus';
import { createSeededRandom } from '@suuudokuuu/solver-core';
import { findPlacementChain } from '@suuudokuuu/techniques';
import { describe, expect, it } from 'vitest';

import { getCellKey } from '../../src/@generic/utils/get-cell-key.util';
import { FieldEngine } from '../../src/field-engine/classes/field-engine';
import { StepScriptStepKindEnum } from '../../src/step-script/enums/step-script-step-kind.enum';
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

const cases = [...generatedPuzzles, ...corpusPuzzles];

const getBlankCells = (engine: FieldEngine): CellInterface[] => engine.Sudoku.Field.flat().filter(cell => engine.Sudoku.isBlankCell(cell));

const getRemainingCandidateCount = (engine: FieldEngine): number =>
    getBlankCells(engine).reduce(
        (total, cell) =>
            total +
            engine.Sudoku.getCellCandidates(cell).filter(
                value => !(engine.getSnapshot().eliminatedCandidates[getCellKey(cell)] ?? []).includes(value)
            ).length,
        0
    );

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

const playHints = (puzzle: string, noteMode: NoteModeType): { outcome: string; placements: number; problems: string[] } => {
    const engine = createEngine(puzzle, noteMode);
    const problems: string[] = [];
    let placements = 0;
    const progressLimit = getRemainingCandidateCount(engine);

    for (let hint = 0; hint <= progressLimit; hint += 1) {
        const script = findHintStepScript(engine.Sudoku, engine.getSnapshot().eliminatedCandidates);

        if (engine.getSnapshot().isWon || script === null) {
            return { outcome: engine.getSnapshot().isWon ? 'solved' : 'unsolved', placements, problems };
        }

        const blankCount = getBlankCells(engine).length;
        const { placement } = script;
        const solutionValue = placement ? engine.Sudoku.getCorrectValue(placement.cell) : 0;
        const wrongEliminations = script.eliminations.filter(({ cell, value }) => engine.Sudoku.getCorrectValue(cell) === value);
        const candidatesBefore = getRemainingCandidateCount(engine);
        const chain = findPlacementChain(
            engine.Sudoku,
            undefined,
            getBlankCells(engine).flatMap(cell =>
                (engine.getSnapshot().eliminatedCandidates[getCellKey(cell)] ?? []).map(value => ({ cell, value }))
            )
        );
        const chainPlacement = chain.at(-1);

        if (chain.length > 0) {
            problems.push(
                ...(script.steps.filter(step => step.kind === StepScriptStepKindEnum.PlaceValue).length === 1
                    ? []
                    : [`hint ${hint} did not preserve the fitting placement chain`]),
                ...(placement &&
                chainPlacement &&
                placement.value === chainPlacement.value &&
                placement.cell.x === chainPlacement.cell.x &&
                placement.cell.y === chainPlacement.cell.y
                    ? []
                    : [`hint ${hint} changed the fitting chain's placement`])
            );
        }

        engine.startStepScript(script);
        engine.applyStepScript();

        if (placement) {
            placements += 1;
        }

        const placedValue = placement ? engine.Sudoku.Field[placement.cell.y][placement.cell.x].value : 0;
        const lostSolutionNotes = getBlankCells(engine).filter(
            cell => noteMode !== 'no notes' && !engine.getCellCandidates(cell).includes(engine.Sudoku.getCorrectValue(cell))
        );

        problems.push(
            ...(placement && (placedValue !== solutionValue || placement.value !== solutionValue)
                ? [`hint ${hint} placed a wrong digit`]
                : []),
            ...(getBlankCells(engine).length === blankCount - Number(Boolean(placement))
                ? []
                : [`hint ${hint} changed the wrong number of cells`]),
            ...(getRemainingCandidateCount(engine) >= candidatesBefore ? [`hint ${hint} did not reduce the live candidate count`] : []),
            ...(engine.getSnapshot().mistakes === 0 ? [] : [`hint ${hint} registered a mistake`]),
            ...wrongEliminations.map(({ cell, value }) => `hint ${hint} eliminated the solution ${value} at ${cell.y}-${cell.x}`),
            ...lostSolutionNotes.map(cell => `hint ${hint} left ${cell.y}-${cell.x} without its solution candidate`)
        );
    }

    return { outcome: 'stalled', placements, problems };
};

describe('hint progress over puzzle corpora', () => {
    it.each(
        cases.flatMap(([label, puzzle], index): [string, NoteModeType, string][] => [
            [label, 'no notes', puzzle],
            [label, noteModes[index % noteModes.length], puzzle]
        ])
    )(
        '%s, %s: each hint makes safe progress until the board is solved',
        (_label, noteMode, puzzle) => {
            expect.assertions(3);

            const { placements, outcome, problems } = playHints(puzzle, noteMode);

            expect(problems).toEqual([]);
            expect(outcome).toBe('solved');
            expect(placements).toBe(getBlankCells(createEngine(puzzle, 'no notes')).length);
        },
        corpusTimeoutMilliseconds
    );
});
