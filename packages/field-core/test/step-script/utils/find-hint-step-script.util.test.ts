import { DifficultyEnum } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { isDefined } from '@rnw-community/shared';

import { getCellKey } from '../../../src/@generic/utils/get-cell-key.util';
import { FieldEngine } from '../../../src/field-engine/classes/field-engine';
import { StepScriptStepKindEnum } from '../../../src/step-script/enums/step-script-step-kind.enum';
import { findHintStepScript, findRevealStepScript } from '../../../src/step-script/utils/find-hint-step-script.util';

import type { FieldCandidatesType } from '../../../src/field-engine/types/field-candidates.type';
import type { StepScriptInterface } from '../../../src/step-script/interfaces/step-script.interface';

const pointingPairBoard = '.3.1.......17..63.5..623..1...2...13..38.1..61..3.48..357986142894512367.1.437.8.';
const guessBoard = '800000000003600000070090200050007000000045700000100030001000068008500010090000400'.replaceAll('0', '.');

const longChainBoard = '000070940070090005300005070087400100463080000000007080800700000700000028050268000'.replaceAll('0', '.');
const columnQuadBoard = '.....3...9....6......4...371..2..8..........5.8453.......3..67..27...........891.';
const pointingPairDetourBoard = '..6....9...45....8.27....4..4..7..6.......8.......2...4156...8.2.9...41.3.8.4...5';
const aicDetourBoard = '..31...5..4...5...75.2....13..5..71..8..6............9.....4..6.2..5.9..9..7...8.';
const revealTargetBoard = '001004800302000045540003090800040300000905410400006002030008600050370000100460000';
const continuedEliminations: Partial<Record<SolutionTechniqueEnum, FieldCandidatesType>> = {
    [SolutionTechniqueEnum.NakedQuad]: {
        '8-4': [6],
        '3-7': [9, 3, 4],
        '1-3': [9, 5],
        '1-4': [9],
        '6-3': [9],
        '7-5': [5, 6],
        '8-2': [4, 5],
        '4-8': [6],
        '4-0': [6],
        '5-1': [8],
        '3-8': [6],
        '4-1': [8, 5],
        '6-5': [9],
        '4-7': [9],
        '7-4': [6],
        '0-6': [5],
        '8-3': [3]
    },
    [SolutionTechniqueEnum.HiddenTriple]: { '8-7': [2], '8-8': [2, 6], '0-4': [6], '0-5': [6], '6-6': [6], '6-8': [6] },
    [SolutionTechniqueEnum.FinnedSwordfish]: {
        '6-0': [3],
        '6-2': [3, 1],
        '3-0': [4],
        '3-6': [4],
        '1-1': [1],
        '0-6': [8],
        '1-6': [8],
        '6-6': [8, 9],
        '6-7': [8, 9],
        '1-4': [3],
        '0-3': [9],
        '1-3': [9]
    },
    [SolutionTechniqueEnum.XChain]: { '0-6': [1], '7-0': [6, 8], '4-1': [6, 8], '5-2': [8], '2-2': [4] },
    [SolutionTechniqueEnum.XYChain]: { '1-7': [9], '4-4': [4], '7-4': [3], '7-7': [9], '8-1': [4], '8-4': [5] },
    [SolutionTechniqueEnum.AIC]: { '1-1': [4], '8-8': [9], '3-1': [9], '4-0': [9], '5-0': [9], '5-1': [9], '2-4': [1], '2-3': [3] },
    [SolutionTechniqueEnum.EmptyRectangle]: { '1-1': [9], '3-7': [5], '4-8': [9], '7-8': [3] },
    [SolutionTechniqueEnum.ALSXZ]: { '2-7': [1], '7-3': [3], '7-5': [1], '7-8': [1], '8-7': [3] }
};
const solvedBoard = '123456789456789123789123456214365897365897214897214365531642978642978531978531642';

const createEngine = (sudokuString: string, showAutoCandidates = false): FieldEngine =>
    new FieldEngine({ sudokuString, difficulty: DifficultyEnum.Medium, showAutoCandidates });

const requireScript = (engine: FieldEngine): StepScriptInterface => {
    const script = findHintStepScript(engine.Sudoku, engine.getSnapshot().eliminatedCandidates);

    if (script === null) {
        throw new Error('Expected a hint step script');
    }

    return script;
};

const getBlankCount = (engine: FieldEngine): number => engine.Sudoku.Field.flat().filter(cell => engine.Sudoku.isBlankCell(cell)).length;

describe('findHintStepScript', () => {
    it('chains the pointing pair into the hidden single it enables', () => {
        expect.assertions(5);

        const script = requireScript(createEngine(pointingPairBoard));

        expect(script.technique).toBe(SolutionTechniqueEnum.PointingPair);
        expect(script.steps.map(step => step.kind)).toEqual([
            StepScriptStepKindEnum.RevealCandidates,
            StepScriptStepKindEnum.StrikeCandidates,
            StepScriptStepKindEnum.RevealCandidates,
            StepScriptStepKindEnum.PlaceValue
        ]);
        expect(script.steps.map(step => step.narration.technique)).toEqual([
            SolutionTechniqueEnum.PointingPair,
            SolutionTechniqueEnum.PointingPair,
            SolutionTechniqueEnum.HiddenSingle,
            SolutionTechniqueEnum.HiddenSingle
        ]);
        expect(script.eliminations.map(({ cell, value }) => `${cell.y}-${cell.x}=${value}`)).toEqual(['0-6=4', '2-6=4']);
        expect(script.placement && { y: script.placement.cell.y, x: script.placement.cell.x, value: script.placement.value }).toEqual({
            y: 2,
            x: 1,
            value: 4
        });
    });

    it('searches past irrelevant eliminations to the hidden pair that enables the first placement', () => {
        expect.assertions(2);

        const script = requireScript(createEngine(columnQuadBoard));

        expect(script.steps.map(step => [step.kind, step.narration.technique])).toEqual([
            [StepScriptStepKindEnum.RevealCandidates, SolutionTechniqueEnum.PointingPair],
            [StepScriptStepKindEnum.StrikeCandidates, SolutionTechniqueEnum.PointingPair],
            [StepScriptStepKindEnum.RevealCandidates, SolutionTechniqueEnum.HiddenPair],
            [StepScriptStepKindEnum.StrikeCandidates, SolutionTechniqueEnum.HiddenPair],
            [StepScriptStepKindEnum.RevealCandidates, SolutionTechniqueEnum.HiddenSingle],
            [StepScriptStepKindEnum.PlaceValue, SolutionTechniqueEnum.HiddenSingle]
        ]);
        expect(script.placement && { y: script.placement.cell.y, x: script.placement.cell.x, value: script.placement.value }).toEqual({
            y: 2,
            x: 4,
            value: 9
        });
    });

    it('solves the naked quad board hint by hint without revealing a digit', () => {
        expect.assertions(2);

        const engine = createEngine(columnQuadBoard);
        const hintTechniques: SolutionTechniqueEnum[] = [];

        const findNextHint = (): StepScriptInterface | null => findHintStepScript(engine.Sudoku, engine.getSnapshot().eliminatedCandidates);

        for (let script = findNextHint(); script !== null; script = findNextHint()) {
            hintTechniques.push(...script.steps.map(step => step.narration.technique));
            engine.startStepScript(script);
            engine.applyStepScript();
        }

        expect(hintTechniques).not.toContain(SolutionTechniqueEnum.Guess);
        expect(engine.getSnapshot().isWon).toBe(true);
    });

    it('places the hinted digit on apply without notes and moves the next hint on', () => {
        expect.assertions(4);

        const engine = createEngine(pointingPairBoard);
        const script = requireScript(engine);

        engine.startStepScript(script);
        engine.applyStepScript();

        const nextScript = requireScript(engine);

        expect(engine.Sudoku.Field[2][1].value).toBe(4);
        expect(engine.getSnapshot().mistakes).toBe(0);
        expect(getBlankCount(engine)).toBe(35);
        expect(nextScript.placement?.cell).not.toEqual(script.placement?.cell);
    });

    it('strikes the chain eliminations from the auto candidates on apply', () => {
        expect.assertions(2);

        const engine = createEngine(pointingPairBoard, true);
        const script = requireScript(engine);
        const [[, , , , , , eliminatedCell]] = engine.Sudoku.Field;

        expect(engine.getCellCandidates(eliminatedCell)).toContain(4);

        engine.startStepScript(script);
        engine.applyStepScript();

        expect(engine.getCellCandidates(eliminatedCell)).not.toContain(4);
    });

    it('ignores a removed solution candidate and hints the solution digit', () => {
        expect.assertions(2);

        const engine = createEngine(pointingPairBoard, true);

        engine.removeCandidate(engine.Sudoku.Field[2][1], 4);

        const { placement } = requireScript(engine);

        expect(engine.getSnapshot().eliminatedCandidates['2-1']).toEqual([4]);
        expect(placement && { y: placement.cell.y, x: placement.cell.x, value: placement.value }).toEqual({ y: 2, x: 1, value: 4 });
    });

    it('undoes an applied chain hint in two steps: the placement, then every elimination at once', () => {
        expect.assertions(4);

        const engine = createEngine(pointingPairBoard);

        for (const cell of engine.Sudoku.Field.flat().filter(fieldCell => engine.Sudoku.isBlankCell(fieldCell))) {
            for (const value of engine.Sudoku.getCellCandidates(cell)) {
                engine.toggleCandidate(cell, value);
            }
        }

        const candidatesBefore = engine.getSnapshot().candidates;

        engine.startStepScript(requireScript(engine));
        engine.applyStepScript();

        expect(engine.getSnapshot().candidates['0-6']).not.toContain(4);

        engine.undo();

        expect(engine.Sudoku.Field[2][1].value).toBe(0);
        expect(engine.getSnapshot().candidates['0-6']).not.toContain(4);

        engine.undo();

        expect(engine.getSnapshot().candidates).toEqual(candidatesBefore);
    });

    describe('on the shipped Hermes runtime, which has no Array.prototype.toSorted', () => {
        const toSortedDescriptor = Object.getOwnPropertyDescriptor(Array.prototype, 'toSorted');

        beforeEach(() => {
            Reflect.deleteProperty(Array.prototype, 'toSorted');
        });

        afterEach(() => {
            if (isDefined(toSortedDescriptor)) {
                Reflect.defineProperty(Array.prototype, 'toSorted', toSortedDescriptor);
            }
        });

        it('reveals the solution digit of the fewest-candidate cell when the position needs a guess', () => {
            expect.assertions(4);

            const engine = createEngine(guessBoard);
            const blankCells = engine.Sudoku.Field.flat().filter(cell => engine.Sudoku.isBlankCell(cell));
            const fewestCandidates = Math.min(...blankCells.map(cell => engine.Sudoku.getCellCandidates(cell).length));
            const [revealCell] = blankCells.filter(cell => engine.Sudoku.getCellCandidates(cell).length === fewestCandidates);
            const script = requireScript(engine);

            engine.startStepScript(script);
            engine.applyStepScript();

            expect(script.steps.map(step => [step.kind, step.narration.technique])).toEqual([
                [StepScriptStepKindEnum.RevealCandidates, SolutionTechniqueEnum.Guess],
                [StepScriptStepKindEnum.PlaceValue, SolutionTechniqueEnum.Guess]
            ]);
            expect(script.placement?.cell).toEqual(revealCell);
            expect(engine.Sudoku.Field[revealCell.y][revealCell.x].value).toBe(engine.Sudoku.getCorrectValue(revealCell));
            expect(engine.getSnapshot().mistakes).toBe(0);
        });
    });

    it.each([
        ['the forcing-chain detour board', pointingPairDetourBoard],
        ['the reported AIC board', aicDetourBoard]
    ])('teaches the lone pointing pair on %s instead of a far harder route to a digit', (_label, board) => {
        expect.assertions(3);

        const engine = createEngine(board);
        const script = requireScript(engine);

        expect(script.steps.map(step => [step.kind, step.narration.technique])).toEqual([
            [StepScriptStepKindEnum.RevealCandidates, SolutionTechniqueEnum.PointingPair],
            [StepScriptStepKindEnum.StrikeCandidates, SolutionTechniqueEnum.PointingPair]
        ]);
        expect(script.placement).toBeUndefined();
        expect(script.eliminations.every(({ cell, value }) => engine.Sudoku.getCorrectValue(cell) !== value)).toBe(true);
    });

    it('teaches the first elimination when the placement chain exceeds its budget and advances after applying it', () => {
        const engine = createEngine(longChainBoard);
        const firstScript = requireScript(engine);
        const blankCount = getBlankCount(engine);

        expect(firstScript.placement).toBeUndefined();
        expect(firstScript.technique).not.toBe(SolutionTechniqueEnum.Guess);
        expect(firstScript.steps.map(step => step.kind)).toEqual([
            StepScriptStepKindEnum.RevealCandidates,
            StepScriptStepKindEnum.StrikeCandidates
        ]);
        expect(firstScript.steps[0]).toMatchObject({ patternCells: firstScript.patternCells });
        expect(firstScript.steps[1]).toMatchObject({ eliminations: firstScript.eliminations });
        expect(firstScript.eliminations.length).toBeGreaterThan(0);
        expect(firstScript.eliminations.every(({ cell, value }) => engine.Sudoku.getCorrectValue(cell) !== value)).toBe(true);

        engine.startStepScript(firstScript);
        engine.applyStepScript();

        const nextScript = findHintStepScript(engine.Sudoku, engine.getSnapshot().eliminatedCandidates);
        const restored = new FieldEngine(engine.serialize());

        expect(getBlankCount(engine)).toBe(blankCount);
        expect(engine.getSnapshot().eliminatedCandidates).not.toEqual({});
        expect(nextScript?.eliminations).not.toEqual(firstScript.eliminations);
        expect(findHintStepScript(restored.Sudoku, restored.getSnapshot().eliminatedCandidates)?.eliminations).toEqual(
            nextScript?.eliminations
        );

        engine.undo();

        expect(engine.getSnapshot().eliminatedCandidates).toEqual({});
    });

    it('does not place a digit until an explicit reveal script is applied', () => {
        const engine = createEngine(longChainBoard);
        const blankCount = getBlankCount(engine);
        const firstScript = requireScript(engine);
        const revealScript = findRevealStepScript(engine.Sudoku);

        expect(firstScript.placement).toBeUndefined();
        expect(revealScript?.technique).toBe(SolutionTechniqueEnum.Guess);

        if (!isDefined(revealScript)) {
            throw new Error('Expected an explicit reveal script');
        }

        engine.startStepScript(revealScript);

        expect(getBlankCount(engine)).toBe(blankCount);

        engine.applyStepScript();

        expect(getBlankCount(engine)).toBe(blankCount - 1);
    });

    it('reveals the open hint target cell', () => {
        const engine = createEngine(revealTargetBoard);
        const revealScript = findRevealStepScript(engine.Sudoku, engine.getSnapshot().eliminatedCandidates, engine.Sudoku.Field[4][8]);

        expect(revealScript?.placement).toMatchObject({ cell: { y: 4, x: 8 }, value: 8 });
        expect(findRevealStepScript(engine.Sudoku)?.placement?.cell).not.toMatchObject({ y: 4, x: 8 });
    });

    it('falls back to the fewest candidates left after the player eliminations', () => {
        const engine = createEngine(revealTargetBoard);
        const [lastCell] = engine.Sudoku.Field[8].slice(-1);
        const correctValue = engine.Sudoku.getCorrectValue(lastCell);
        const eliminatedCandidates = {
            [getCellKey(lastCell)]: engine.Sudoku.getCellCandidates(lastCell).filter(value => value !== correctValue)
        };

        expect(findRevealStepScript(engine.Sudoku, eliminatedCandidates)?.placement).toMatchObject({
            cell: { y: 8, x: 8 },
            value: correctValue
        });
        expect(findRevealStepScript(engine.Sudoku, eliminatedCandidates, engine.Sudoku.Field[0][2])?.placement?.cell).toMatchObject({
            y: 8,
            x: 8
        });
    });

    it('returns null on a solved board', () => {
        expect.assertions(1);

        expect(findHintStepScript(createEngine(solvedBoard).Sudoku)).toBeNull();
    });

    it.each([
        [SolutionTechniqueEnum.FullHouse, '574819326928673514316452.78795268431863741295241935867159387642482196753637524189'],
        [SolutionTechniqueEnum.NakedSingle, '157968342293417658864...719.7.851.939..3.687553879..6132..7918478....926..9.8.537'],
        [SolutionTechniqueEnum.HiddenSingle, '1234795688476523919563..274.615.79..39.12.7.6.7896341..127968..68923514773.8..629'],
        [SolutionTechniqueEnum.PointingPair, '157968342293417658864...719.7.851.939..3.687553879..6132..7918478....926..9.8.537'],
        [SolutionTechniqueEnum.PointingTriple, '124689573835741...9763524815.24.8...64.9.5..878.2.6.5425.8.439.36...7.4.4....3...'],
        [SolutionTechniqueEnum.BoxLineReduction, '289..5731.6.9..845..518.629...2.9154592814367..475.298.5...89..9.....5...2759.4.6'],
        [SolutionTechniqueEnum.NakedPair, '72589146349863572136124795884...6.7.51672.8.4.7..8.6..68.9..5...54....8..3...8...'],
        [SolutionTechniqueEnum.NakedTriple, '....8...2.6...4....7....8.9..4.2...8.....1.35..3...6....6.......5.79...61....6.5.'],
        [SolutionTechniqueEnum.NakedQuad, '16......9.49..3.8...2...6...7..58.......2.......7.4.5...6...29..3.8...769.......1'],
        [SolutionTechniqueEnum.HiddenPair, '3....4..6....2..7..658....113.5..9..6..291.....9.........9..7.484..........46..32'],
        [SolutionTechniqueEnum.HiddenTriple, '1..4.......61....3.8.2..4.1...6785.4...9........5..76...27.....59.814......3..9..'],
        [SolutionTechniqueEnum.XWing, '867945123913682745452317....294.35811358.9..4.48.51.3.376198452594..6.1.2815.4..6'],
        [SolutionTechniqueEnum.Swordfish, '53.7..9......3..7...8..5..36.31794...8..2..9...9..8.31...4..3...6..9..4...2..6..9'],
        [SolutionTechniqueEnum.FinnedXWing, '5132948764.96.51322..31.94593..2.48112.4.93677.413.529342..1698857963214691842753'],
        [SolutionTechniqueEnum.FinnedSwordfish, '.27.5...11.5..2..76347..2.5.762...5334..65.7225.873..646.527...5.2.3.7647.34.652.'],
        [SolutionTechniqueEnum.SashimiXWing, '1234567..457189236689273451231.956.4..634152..4562.9133.85641.2562.1.34..14.32865'],
        [SolutionTechniqueEnum.SashimiSwordfish, '893762541.....8.23.241358..47.8.623...82734..23.....8...238..54387...9.254..2.3.8'],
        [SolutionTechniqueEnum.XYWing, '724581396953762814186..4752569423178..18.926.2.81.694..12..85378.5.17.29.972.5.81'],
        [SolutionTechniqueEnum.XYZWing, '812756943569348721347.....64.6..7.3.2.1....747534.21.9.7...439.934.75.18.2.9..4.7'],
        [SolutionTechniqueEnum.WWing, '361849275294.5.816785126934.42..17.8.18...3..67329845143691258785.6..1..12..856.3'],
        [SolutionTechniqueEnum.XChain, '..67.8.3939.52..7.7....3....49.37..1..3..54..51....3..2..37.91......97..9...5..6.'],
        [SolutionTechniqueEnum.XYChain, '782.1....35...4..24.92.758.6..1.82.7..87.....175.238.65..6793.8.....1..48.7..2.6.'],
        [SolutionTechniqueEnum.AIC, '...5..9.6..5.9..7...8..4...7.16...4..5..7.213......76.4..9.53.75.3.8...1..7......'],
        [SolutionTechniqueEnum.NishioForcingChain, '.62....4545.6...12.13245....2.153.6464...253113546....571384...3947261582865..473'],
        [SolutionTechniqueEnum.EmptyRectangle, '....27..1..7..1.2.123.45......7163.231628....7.2.5316823.16.875875..261..615782..'],
        [SolutionTechniqueEnum.ALSXZ, '.325.468.864.3..2...5826...3281497566.925.1.8.51..8.922.3..58.9.86....7.597.8...4'],
        [SolutionTechniqueEnum.SueDeCoq, '9...51348....986758.5.6329121.985.36..8327.19..9146.82783612954..2839167.9.574823']
    ])('includes technique %i in a hint that places the solution digit', (technique, board) => {
        expect.assertions(5);

        const engine = new FieldEngine({
            sudokuString: board,
            difficulty: DifficultyEnum.Medium,
            eliminatedCandidates: continuedEliminations[technique] ?? {}
        });
        const script = requireScript(engine);
        const placement = script.placement ?? { cell: engine.Sudoku.Field[0][0], value: 0 };
        const solutionValue = engine.Sudoku.getCorrectValue(placement.cell);
        const blankCount = getBlankCount(engine);

        engine.startStepScript(script);
        engine.applyStepScript();

        expect(script.steps.map(step => step.narration.technique)).toContain(technique);
        expect(script.steps.filter(step => step.kind === StepScriptStepKindEnum.PlaceValue)).toHaveLength(1);
        expect(placement.value).toBe(solutionValue);
        expect(engine.Sudoku.Field[placement.cell.y][placement.cell.x].value).toBe(solutionValue);
        expect(getBlankCount(engine)).toBe(blankCount - 1);
    });
});
