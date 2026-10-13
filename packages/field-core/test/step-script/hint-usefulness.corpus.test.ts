import { it } from '@effect/vitest';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { getHellCorpusRecord, hellCorpusSize } from '@suuudokuuu/hell-corpus';
import { seTechniqueRatings } from '@suuudokuuu/rating';
import { CandidateContext, SolutionTechniqueEnum, createTechniqueStrategies } from '@suuudokuuu/techniques';
import * as Effect from 'effect/Effect';
import { assert, describe } from 'vitest';

import { getCellKey } from '../../src/@generic/utils/get-cell-key.util';
import { FieldEngine } from '../../src/field-engine/classes/field-engine';
import { HintLevelEnum } from '../../src/step-script/enums/hint-level.enum';
import { StepScriptStepKindEnum } from '../../src/step-script/enums/step-script-step-kind.enum';
import { buildStepScriptState } from '../../src/step-script/utils/build-step-script-state.util';
import { findHintStepScript } from '../../src/step-script/utils/find-hint-step-script.util';

import type { StepScriptInterface } from '../../src/step-script/interfaces/step-script.interface';
import type { TechniqueResultInterface } from '@suuudokuuu/techniques';

const hellCorpusStride = 20;
const maxHintsPerBoard = 200;
const maxTintedCellsPerPage = 12;
const maxMedianBranchLinks = 8;
const minWithinBandShare = 0.95;
const difficultyTolerance = 1;
const corpusTimeoutMilliseconds = 120_000;

class HintUsefulnessMetrics {
    readonly branchLinkCounts: number[] = [];
    readonly pageCounts: number[] = [];
    readonly tintedCellCounts: number[] = [];
    hintCount = 0;
    fallbackCount = 0;
    withinBandCount = 0;

    record(script: StepScriptInterface, pageCount: number, isWithinBand: boolean): void {
        this.hintCount += 1;
        this.fallbackCount += Number(script.technique === SolutionTechniqueEnum.Guess);
        this.withinBandCount += Number(isWithinBand);
        this.pageCounts.push(pageCount);
        this.branchLinkCounts.push(
            ...script.steps.flatMap(step => (step.kind === StepScriptStepKindEnum.SHOW_BRANCH ? [step.branch.implications.length] : []))
        );
    }
}

const getTintedCellCount = (engine: FieldEngine): number => {
    const { hintLevel, revealedImplicationCount, stepIndex, stepScript } = engine.getSnapshot();
    const { patternCellKeys, regionCellKeys, targetCellKey } = buildStepScriptState(
        stepScript,
        stepIndex,
        hintLevel,
        revealedImplicationCount
    );

    return new Set([...patternCellKeys, ...regionCellKeys, ...(targetCellKey === null ? [] : [targetCellKey])]).size;
};

const getMedian = (values: readonly number[]): number => {
    const sortedValues = [...values].sort((left, right) => left - right);

    return sortedValues[Math.floor(sortedValues.length / 2)] ?? 0;
};

const getDistribution = (values: readonly number[]): Record<number, number> => {
    const distribution: Record<number, number> = {};

    for (const value of values) {
        distribution[value] = (distribution[value] ?? 0) + 1;
    }

    return distribution;
};

const isProgressingResult = (context: CandidateContext, result: TechniqueResultInterface): boolean =>
    result.kind === 'placement'
        ? context.getCandidates(result.cell).length > 0
        : result.eliminations.some(elimination => context.getCandidates(elimination.cell).includes(elimination.value));

const isWithinCheapestBand = (engine: FieldEngine, technique: SolutionTechniqueEnum): boolean => {
    const { eliminatedCandidates } = engine.getSnapshot();
    const context = CandidateContext.fromSudoku(engine.Sudoku).withEliminations(
        engine.Sudoku.Field.flat()
            .filter(cell => engine.Sudoku.isBlankCell(cell))
            .flatMap(cell => (eliminatedCandidates[getCellKey(cell)] ?? []).map(value => ({ cell, value })))
    );
    const bandMinimum = seTechniqueRatings[technique] - difficultyTolerance;

    return !createTechniqueStrategies()
        .filter(strategy => seTechniqueRatings[strategy.technique] < bandMinimum)
        .some(strategy => strategy.find(context).some(result => isProgressingResult(context, result)));
};

const playHints = (puzzle: string, metrics: HintUsefulnessMetrics): void => {
    const engine = new FieldEngine({ sudokuString: puzzle, difficulty: DifficultyEnum.Hell });

    for (let hintIndex = 0; hintIndex < maxHintsPerBoard && !engine.getSnapshot().isWon; hintIndex += 1) {
        const script = findHintStepScript(engine.Sudoku, engine.getSnapshot().eliminatedCandidates);

        if (script === null) {
            return;
        }

        engine.startStepScript(script, HintLevelEnum.TECHNIQUE);
        metrics.record(script, engine.getSnapshot().hintPageCount, isWithinCheapestBand(engine, script.technique));
        metrics.tintedCellCounts.push(getTintedCellCount(engine));

        while (engine.getSnapshot().hintPageIndex < engine.getSnapshot().hintPageCount - 1) {
            engine.hintNext();
            metrics.tintedCellCounts.push(getTintedCellCount(engine));
        }

        engine.applyStepScript();
    }
};

describe('hint usefulness over a Hell corpus sample', () => {
    it.effect(
        'keeps hints short, focused, logical and at the simplest available difficulty',
        ({ annotate }) =>
            Effect.gen(function* () {
                const metrics = new HintUsefulnessMetrics();

                for (let index = 0; index < hellCorpusSize; index += hellCorpusStride) {
                    playHints(getHellCorpusRecord(index).puzzle, metrics);
                }

                const withinBandShare = metrics.withinBandCount / metrics.hintCount;

                yield* Effect.promise(() =>
                    annotate(
                        JSON.stringify({
                            hints: metrics.hintCount,
                            medianBranchLinks: getMedian(metrics.branchLinkCounts),
                            branchLinks: getDistribution(metrics.branchLinkCounts),
                            fallbackShare: metrics.fallbackCount / metrics.hintCount,
                            withinBandShare,
                            maxTintedCellsPerPage: Math.max(...metrics.tintedCellCounts),
                            pageCounts: getDistribution(metrics.pageCounts)
                        })
                    )
                );

                assert.isAbove(metrics.hintCount, 0);
                assert.isAtMost(getMedian(metrics.branchLinkCounts), maxMedianBranchLinks);
                assert.strictEqual(metrics.fallbackCount, 0);
                assert.isAtLeast(withinBandShare, minWithinBandShare);
                assert.isAtMost(Math.max(...metrics.tintedCellCounts), maxTintedCellsPerPage);
            }),
        corpusTimeoutMilliseconds
    );
});
