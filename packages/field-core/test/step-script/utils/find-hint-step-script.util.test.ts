import { DifficultyEnum } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import { describe, expect, it } from 'vitest';

import { FieldEngine } from '../../../src/field-engine/classes/field-engine';
import { StepScriptStepKindEnum } from '../../../src/step-script/enums/step-script-step-kind.enum';
import { findHintStepScript } from '../../../src/step-script/utils/find-hint-step-script.util';

import type { StepScriptInterface } from '../../../src/step-script/interfaces/step-script.interface';

const pointingPairBoard = '.3.1.......17..63.5..623..1...2...13..38.1..61..3.48..357986142894512367.1.437.8.';
const guessBoard = '800000000003600000070090200050007000000045700000100030001000068008500010090000400'.replaceAll('0', '.');

const longChainBoard = '8.72.14..34....1.2.5.....9..1...39..4...5.6.8..56..2.........2...437....5..8.9..4';
const solvedBoard = '123456789456789123789123456214365897365897214897214365531642978642978531978531642';

const createEngine = (sudokuString: string, showAutoCandidates = false): FieldEngine =>
    new FieldEngine({ sudokuString, difficulty: DifficultyEnum.Medium, showAutoCandidates });

const requireScript = (engine: FieldEngine): StepScriptInterface => {
    const script = findHintStepScript(engine.Sudoku);

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

    it.each([
        ['needs a guess', guessBoard],
        ['exceeds the chain cap', longChainBoard]
    ])('reveals the solution digit of the fewest-candidate cell when the position %s', (_label, board) => {
        expect.assertions(4);

        const engine = createEngine(board);
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

    it('returns null on a solved board', () => {
        expect.assertions(1);

        expect(findHintStepScript(createEngine(solvedBoard).Sudoku)).toBeNull();
    });

    it.each([
        [SolutionTechniqueEnum.FullHouse, '574819326928673514316452.78795268431863741295241935867159387642482196753637524189'],
        [SolutionTechniqueEnum.NakedSingle, '1234795688476523919653812742147389563795164825869247134318956276521.78.97982.31.5'],
        [SolutionTechniqueEnum.HiddenSingle, '1234795688476523919563..274.615.79..39.12.7.6.7896341..127968..68923514773.8..629'],
        [SolutionTechniqueEnum.PointingPair, '157968342293417658864...719.7.851.939..3.687553879..6132..7918478....926..9.8.537'],
        [SolutionTechniqueEnum.PointingTriple, '124689573835741...9763524815.24.8...64.9.5..878.2.6.5425.8.439.36...7.4.4....3...'],
        [SolutionTechniqueEnum.BoxLineReduction, '289..5731.6.9..845..518.629...2.9154592814367..475.298.5...89..9.....5...2759.4.6'],
        [SolutionTechniqueEnum.NakedPair, '72589146349863572136124795884...6.7.51672.8.4.7..8.6..68.9..5...54....8..3...8...'],
        [SolutionTechniqueEnum.NakedTriple, '8.4..926..7...2...9..68..475.9..74..4...9...37..2..9..2.793.854..5..8............'],
        [SolutionTechniqueEnum.NakedQuad, '39.6.......7.......6..9.12......5....2..1..6....4.6....85.6.791......4.......7.32'],
        [SolutionTechniqueEnum.HiddenPair, '3....4..6....2..7..658....113.5..9..6..291.....9.........9..7.484..........46..32'],
        [SolutionTechniqueEnum.HiddenTriple, '165.32...7.9..1..34........6.....2..2....5.84..7...1..8...6...7.1...85.2.7.....4.'],
        [SolutionTechniqueEnum.XWing, '867945123913682745452317....294.35811358.9..4.48.51.3.376198452594..6.1.2815.4..6'],
        [SolutionTechniqueEnum.Swordfish, '9143..5..65..1..343.7..4..12.9...4..46..9....5.1846..28..7..2.979.48..5.1.5..9..7'],
        [SolutionTechniqueEnum.FinnedXWing, '5132948764.96.51322..31.94593..2.48112.4.93677.413.529342..1698857963214691842753'],
        [SolutionTechniqueEnum.FinnedSwordfish, '8724596311.4683.72.6372148.2168347....9217368738596124.81362..76279458133.51782.6'],
        [SolutionTechniqueEnum.SashimiXWing, '1234567..457189236689273451231.956.4..634152..4562.9133.85641.2562.1.34..14.32865'],
        [SolutionTechniqueEnum.SashimiSwordfish, '893762541.....8.23.241358..47.8.623...82734..23.....8...238..54387...9.254..2.3.8'],
        [SolutionTechniqueEnum.XYWing, '724581396953762814186..4752569423178..18.926.2.81.694..12..85378.5.17.29.972.5.81'],
        [SolutionTechniqueEnum.XYZWing, '812756943569348721347.....64.6..7.3.2.1....747534.21.9.7...439.934.75.18.2.9..4.7'],
        [SolutionTechniqueEnum.WWing, '361849275294.5.816785126934.42..17.8.18...3..67329845143691258785.6..1..12..856.3'],
        [SolutionTechniqueEnum.XChain, '324875691891..67..576...38..6..5.81....6.892.2.8.97.636...832.94...6...8.8.7....6'],
        [SolutionTechniqueEnum.XYChain, '152489..3864731952.7.652481.173..5..5.......7..8527..9..1945...486.73.95..5...3.4'],
        [SolutionTechniqueEnum.AIC, '4695713828.7.2.4.12.1.....798..1.....42.6..1917.9.28.3.1..9..3.79..8...6.2.......'],
        [SolutionTechniqueEnum.NishioForcingChain, '.62....4545.6...12.13245....2.153.6464...253113546....571384...3947261582865..473']
    ])('includes technique %i in a hint that places the solution digit', (technique, board) => {
        expect.assertions(5);

        const engine = createEngine(board);
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
