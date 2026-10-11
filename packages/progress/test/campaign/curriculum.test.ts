import { assert, it } from '@effect/vitest';
import { findStepScript } from '@suuudokuuu/field-core';
import { Sudoku } from '@suuudokuuu/generator';
import { seTechniqueOrder } from '@suuudokuuu/rating';
import { BitmaskSolver } from '@suuudokuuu/solver-bitmask';
import { parseGridString, UNIQUENESS_COUNT_LIMIT } from '@suuudokuuu/solver-core';
import { CandidateContext, createTechniqueStrategies } from '@suuudokuuu/techniques';
import * as Effect from 'effect/Effect';

import { campaignLessons } from '../../src/campaign/constant/campaign-lessons.constant';
import { requiredUnassistedPracticeCount } from '../../src/campaign/constant/required-unassisted-practice-count.constant';

const strategies = createTechniqueStrategies();
const solver = new BitmaskSolver();

it.effect('ships the contiguous introductory SE ladder with separate examples and two distinct practices', () =>
    Effect.sync(() => {
        assert.deepStrictEqual(
            campaignLessons.map(lesson => lesson.technique),
            seTechniqueOrder.slice(0, 7)
        );
        assert.strictEqual(
            new Set(campaignLessons.flatMap(lesson => lesson.practices.map(practice => practice.id))).size,
            campaignLessons.length * requiredUnassistedPracticeCount
        );

        for (const lesson of campaignLessons) {
            assert.lengthOf(lesson.practices, requiredUnassistedPracticeCount);
            assert.strictEqual(new Set([lesson.exampleBoard, ...lesson.practices.map(practice => practice.board)]).size, 3);
            for (const [practiceIndex, practice] of lesson.practices.entries()) {
                const exampleBoard = practiceIndex === 0 ? lesson.exampleBoard : Array.from(lesson.exampleBoard).reverse().join('');
                assert.strictEqual(
                    practice.board,
                    Array.from({ length: exampleBoard.length }, (_, cellIndex) =>
                        exampleBoard.charAt((cellIndex % 9) * 9 + Math.floor(cellIndex / 9))
                    )
                        .join('')
                        .replaceAll(/[1-9]/gu, digit => String(((Number(digit) + practiceIndex) % 9) + 1))
                );
            }
        }
    })
);

for (const lesson of campaignLessons) {
    for (const [positionIndex, board] of [lesson.exampleBoard, ...lesson.practices.map(practice => practice.board)].entries()) {
        it.effect(`verifies technique ${lesson.technique} position ${positionIndex} against the solution and cheaper deductions`, () =>
            Effect.sync(() => {
                const sudoku = Sudoku.fromString(board);
                const selectedStrategies = strategies.filter(strategy => strategy.technique === lesson.technique);
                const script = findStepScript(sudoku, selectedStrategies);
                const context = CandidateContext.fromSudoku(sudoku);
                const cheaperResults = strategies
                    .filter(strategy => seTechniqueOrder.indexOf(strategy.technique) < seTechniqueOrder.indexOf(lesson.technique))
                    .flatMap(strategy => strategy.find(context));

                assert.strictEqual(solver.countSolutions(parseGridString(board.replaceAll('.', '0')), UNIQUENESS_COUNT_LIMIT), 1);
                assert.isNotNull(script);
                assert.strictEqual(script.technique, lesson.technique);
                assert.isAbove(script.steps.length, 0);

                const { placement } = script;

                if (placement) {
                    assert.strictEqual(placement.value, sudoku.getCorrectValue(placement.cell));
                    assert.isFalse(
                        cheaperResults.some(
                            result =>
                                result.kind === 'placement' &&
                                result.cell.x === placement.cell.x &&
                                result.cell.y === placement.cell.y &&
                                result.value === placement.value
                        )
                    );
                } else {
                    assert.isAbove(script.eliminations.length, 0);
                }

                for (const elimination of script.eliminations) {
                    assert.notStrictEqual(elimination.value, sudoku.getCorrectValue(elimination.cell));
                    assert.include(context.getCandidates(elimination.cell), elimination.value);
                    assert.isFalse(
                        cheaperResults.some(result =>
                            result.eliminations.some(
                                cheaperElimination =>
                                    cheaperElimination.cell.x === elimination.cell.x &&
                                    cheaperElimination.cell.y === elimination.cell.y &&
                                    cheaperElimination.value === elimination.value
                            )
                        )
                    );
                }
            })
        );
    }
}
