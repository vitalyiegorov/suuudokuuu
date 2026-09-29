import { describe, expect, it, jest } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { render } from '@testing-library/react-native';

import { ReplayScreen } from './replay.screen';

import type { CompletedGameInterface } from '../../../history/interfaces/completed-game.interface';

const completedAt = 1759000000000;

const mockUnreplayableGame: CompletedGameInterface = {
    difficulty: DifficultyEnum.Hell,
    rating: 7,
    isRatingCeiling: false,
    encodedState: '',
    elapsedTime: 940,
    score: 7598,
    mistakes: 0,
    maxMistakes: 0,
    completedAt
};

const mockRedirect = jest.fn<(props: { href: string }) => null>(() => null);

jest.mock('expo-router', () => ({ Redirect: (props: { href: string }) => mockRedirect(props) }));
jest.mock('@suuudokuuu/ui', () => ({
    ...jest.requireActual<typeof import('@suuudokuuu/ui')>('@suuudokuuu/ui'),
    useAppLayout: () => ({ sizeClass: 'compact' })
}));
jest.mock('../../../game/hooks/use-board-geometry.hook', () => ({
    useBoardGeometry: () => ({ cellSize: 40, cellMargin: 1, onBoardAreaLayout: jest.fn() })
}));
jest.mock('../../../history/components/replay-actions/replay-actions', () => ({ ReplayActions: () => null }));
jest.mock('../../../history/components/replay-controls/replay-controls', () => ({ ReplayControls: () => null }));
jest.mock('../../../history/components/replay-field/replay-field', () => ({ ReplayField: () => null }));
jest.mock('../../../history/components/replay-header/replay-header', () => ({ ReplayHeader: () => null }));
jest.mock('../../../@generic/hooks/use-app-selector.hook', () => ({ useAppSelector: () => mockUnreplayableGame }));

describe('ReplayScreen', () => {
    it('sends a record whose encoded state cannot be decoded back to history instead of throwing', async () => {
        await render(<ReplayScreen completedAt={completedAt} difficulty={DifficultyEnum.Hell} />);

        expect(mockRedirect).toHaveBeenCalledWith({ href: '/history' });
    });
});
