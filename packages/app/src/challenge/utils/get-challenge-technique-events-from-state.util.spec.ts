import { describe, expect, it } from '@jest/globals';
import { GameStateSerializer } from '@suuudokuuu/encoder';

import { getChallengeTechniqueEventsFromState } from './get-challenge-technique-events-from-state.util';
import { getChallengeTechniqueEvents } from './get-challenge-technique-events.util';

import type { SolutionStepInterface } from '@suuudokuuu/encoder';

const solvedBoard = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';
const givens = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';
const BlankCell = '.';
const StepCount = 4;
const StepDuration = 10;
const StandardMaxMistakes = 3;

const buildSteps = (count: number): SolutionStepInterface[] => {
    const steps: SolutionStepInterface[] = [];

    for (let cellIndex = 0; cellIndex < givens.length && steps.length < count; cellIndex += 1) {
        if (givens.charAt(cellIndex) === BlankCell) {
            steps.push({ cellIndex, value: parseInt(solvedBoard.charAt(cellIndex), 10), ts: StepDuration });
        }
    }

    return steps;
};

describe('getChallengeTechniqueEventsFromState', () => {
    const serializer = new GameStateSerializer();

    it('should decode a challenge state and derive the same events as the direct call', () => {
        expect.assertions(2);

        const steps = buildSteps(StepCount);
        const challengeState = serializer.encode(givens, steps, StandardMaxMistakes, true);
        const events = getChallengeTechniqueEventsFromState(challengeState);

        expect(events).toHaveLength(StepCount);
        expect(events).toStrictEqual(getChallengeTechniqueEvents(givens, steps));
    });

    it('should return no events for an undecodable state', () => {
        expect.assertions(1);

        expect(getChallengeTechniqueEventsFromState('not-a-valid-payload')).toStrictEqual([]);
    });

    it('should return no events for a puzzle share that carries no steps', () => {
        expect.assertions(1);

        const puzzleState = serializer.encode(givens, [], StandardMaxMistakes, false);

        expect(getChallengeTechniqueEventsFromState(puzzleState)).toStrictEqual([]);
    });
});
