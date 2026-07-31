import { describe, expect, it, jest } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { fireEvent, screen } from '@testing-library/react-native';

import { renderWithGameContext } from '../../../../@generic/utils/render-with-game-context.mock';

import { HomeScreenHellCard } from './home-screen-hell-card';
import { HomeScreenHellCardSelectors } from './home-screen-hell-card.selectors';

import type { HellQueueEntryInterface } from '../../../../hell-queue/interfaces/hell-queue-entry.interface';

const HellQueueFieldStringLength = 81;

const buildHellEntry = (id: string): HellQueueEntryInterface => ({
    createdAt: 1,
    generatorVersion: 1,
    givensCount: 20,
    id,
    puzzle: id,
    schemaVersion: 1,
    solution: id
});

describe('HomeScreenHellCard', () => {
    it('renders nothing when the Hell queue is empty', async () => {
        await renderWithGameContext(<HomeScreenHellCard />, { hellQueue: { entries: [] } });

        expect(screen.queryByTestId(HomeScreenHellCardSelectors.Root)).toBeNull();
    });

    it('shows a singular count for a single queued puzzle', async () => {
        await renderWithGameContext(<HomeScreenHellCard />, {
            hellQueue: { entries: [buildHellEntry('1'.repeat(HellQueueFieldStringLength))] }
        });

        expect(screen.getByTestId(HomeScreenHellCardSelectors.Root)).toBeTruthy();
        expect(screen.getByTestId(HomeScreenHellCardSelectors.Count)).toHaveTextContent('1 puzzle ready');
    });

    it('shows a plural count for multiple queued puzzles', async () => {
        const entries = [
            buildHellEntry('1'.repeat(HellQueueFieldStringLength)),
            buildHellEntry('2'.repeat(HellQueueFieldStringLength)),
            buildHellEntry('3'.repeat(HellQueueFieldStringLength))
        ];

        await renderWithGameContext(<HomeScreenHellCard />, { hellQueue: { entries } });

        expect(screen.getByTestId(HomeScreenHellCardSelectors.Count)).toHaveTextContent('3 puzzles ready');
    });

    it('starts a Hell game using the current mistake and challenge settings when pressed', async () => {
        const create = jest.fn();

        await renderWithGameContext(<HomeScreenHellCard />, {
            create,
            hellQueue: { entries: [buildHellEntry('1'.repeat(HellQueueFieldStringLength))] },
            settings: { lastGameChallengeMode: true, lastGameMaxMistakes: 0 }
        });

        await fireEvent.press(screen.getByTestId(HomeScreenHellCardSelectors.Start));

        expect(create).toHaveBeenCalledWith({ difficulty: DifficultyEnum.Hell, isChallengeRun: true, maxMistakes: 0 });
    });

    it('does not start a game while one is already being created', async () => {
        const create = jest.fn();

        await renderWithGameContext(<HomeScreenHellCard />, {
            create,
            hellQueue: { entries: [buildHellEntry('1'.repeat(HellQueueFieldStringLength))] },
            isCreatingGame: true
        });

        await fireEvent.press(screen.getByTestId(HomeScreenHellCardSelectors.Start));

        expect(create).not.toHaveBeenCalled();
    });
});
