import { DifficultyEnum } from '@suuudokuuu/generator';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import { describe, expect, it } from 'vitest';

import { FieldEngine } from '../../../src/field-engine/classes/field-engine';
import { StepScriptStepKindEnum } from '../../../src/step-script/enums/step-script-step-kind.enum';
import { findHintStepScript } from '../../../src/step-script/utils/find-hint-step-script.util';

import type { StepScriptInterface } from '../../../src/step-script/interfaces/step-script.interface';

const pointingPairBoard = '.3.1.......17..63.5..623..1...2...13..38.1..61..3.48..357986142894512367.1.437.8.';
const guessBoard = '800000000003600000070090200050007000000045700000100030001000068008500010090000400'.replaceAll('0', '.');

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

    it('returns null when no placement is reachable without guessing', () => {
        expect.assertions(1);

        expect(findHintStepScript(createEngine(guessBoard).Sudoku)).toBeNull();
    });

    it.each([
        [SolutionTechniqueEnum.FullHouse, '8423591671962785345371648294798126533815467922659374816184239759247853167536.1248'],
        [SolutionTechniqueEnum.NakedSingle, '289715463531964872764832159312479586697358214458..1937926187345143596728875..3691'],
        [SolutionTechniqueEnum.HiddenSingle, '967.21.45854.79.12123.4597.3487165295724981..6192537842961.4.577859.24.14315.72..'],
        [SolutionTechniqueEnum.PointingPair, '.125.4..35963.14.2.34.2.15.4.9..523.1.3.42..5625..374.34825..17961437528257...3.4'],
        [SolutionTechniqueEnum.PointingTriple, '53..2.9...24.3..5...9.4....96..14827...76..9.....981.............64....91.2.5.43.'],
        [SolutionTechniqueEnum.BoxLineReduction, '163.4.9..957836.2.842.9136....9852.35..1236..23.674.9.325.198.6.8..5..394..368..2'],
        [SolutionTechniqueEnum.NakedPair, '8.7.12....45387.12123.458.7..84.62712.67.148.4712.8.....287.1..789164325.1452.7.8'],
        [SolutionTechniqueEnum.NakedTriple, '....2..43.4..6..122.31456...52...46..1465.23.36.4.2.5....53..2443.27..8552...43.6'],
        [SolutionTechniqueEnum.NakedQuad, '.6..21...5..36..12123.456....21.63..61.53.2.4735492168..125...625461....3.6..4521'],
        [SolutionTechniqueEnum.HiddenPair, '.691.7..8..2.8...6.8....1.....7...32.9...8.....63..8...7...4.......5..4.5...76...'],
        [SolutionTechniqueEnum.HiddenTriple, '..2...4..9.563.8..........6....6..81...873.9...8.15...7.63...5.8......4.3...2.1..'],
        [SolutionTechniqueEnum.XWing, '..9.6...76372918454.837596..85619.24.64..2..99.2...6.8..1946.83.965..4..843127596'],
        [SolutionTechniqueEnum.Swordfish, '1...2..45...4.1.232.456......2.54.....71864.241...25...4.61.2...2.....143.124....'],
        [SolutionTechniqueEnum.Jellyfish, '581.94.3..2.6159......831.....3.241713..4.26.......5.3.......2.....3.8...6.8293.1'],
        [SolutionTechniqueEnum.FinnedXWing, '6..2.3.41..1.46.23324175689..2..143643..62158165438972548319267713624895296..7314'],
        [SolutionTechniqueEnum.FinnedSwordfish, '.81.2763.7.6.31..2923648157..231...663728.5.11.875632.375192468869475213214863..5'],
        [SolutionTechniqueEnum.SashimiXWing, '.81.25.644569.18.2.2364815.592.1.4866372845911485967233791526488654..21.21486...5'],
        [SolutionTechniqueEnum.SashimiSwordfish, '.27.54..11.5..2..76347..295.7624..5334..65.7225.873..646.527...5.2...7647.34.652.'],
        [SolutionTechniqueEnum.XYWing, '872.5...115..8..7296.721.8.2168347..549217368738596124481.62..7627.4581.395178246'],
        [SolutionTechniqueEnum.XYZWing, '123579684845361279.6.4823512..61..4.5718249366.49.7...3.27465.8456..8.........46.'],
        [SolutionTechniqueEnum.WWing, '927.54.81185..2..76347..29587624..5334..6587225.873..6468527..95.2...7647.34.6528'],
        [SolutionTechniqueEnum.XChain, '53..2.94..24.3.75..19.4..8.96..14827..176..9.....9816.49....6....64....9172.5.438'],
        [SolutionTechniqueEnum.XYChain, '...721.3...4369.12123845976...574329..2186..7457932168...65.2....82937..2..41.6..'],
        [SolutionTechniqueEnum.AIC, '65.9..4...4..5..36..8..6.955..7..3...7..2.569..2..5.7418.6..2.3....3.687736..29.1'],
        [SolutionTechniqueEnum.UniqueRectangle, '....51.....5368.121.3.24..6...8.21.5...196347.1.4.52.8...287.....461..2..2.54..8.'],
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
