import { describe, expect, it, jest } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { fireEvent, screen } from '@testing-library/react-native';

import { RatingBadgeSelectors } from '../../../../@generic/components/rating-badge/rating-badge.selectors';
import { getRatingExplainerHref } from '../../../../@generic/utils/get-rating-explainer-href.util';
import { renderWithGameContext } from '../../../../@generic/utils/render-with-game-context.mock';
import { InputModeButtonSelectors } from '../../../../game/components/input-mode-button/input-mode-button.selectors';
import { GameScreenSelectors } from '../game-screen.selectors';

import { GameInputTools } from './game-input-tools';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
    router: { push: (...args: unknown[]) => mockPush(...args) },
    useRouter: () => ({ dismissTo: jest.fn(), navigate: jest.fn(), push: jest.fn(), replace: jest.fn() })
}));

const highSampleRating = 8.4;

const renderGameInputTools = (difficulty: DifficultyEnum, rating: number, hideAutoCandidates = false) =>
    renderWithGameContext(<GameInputTools hideAutoCandidates={hideAutoCandidates} />, {
        game: { difficulty, isRatingCeiling: false, rating }
    });

describe('GameInputTools', () => {
    it('renders the pencil and auto-candidates buttons', async () => {
        await renderGameInputTools(DifficultyEnum.Easy, 0);

        expect(screen.getByTestId(InputModeButtonSelectors.Root)).toBeTruthy();
        expect(screen.getByTestId(GameScreenSelectors.TipsButton)).toBeTruthy();
    });

    it('hides the auto-candidates button when asked to', async () => {
        await renderGameInputTools(DifficultyEnum.Easy, 0, true);

        expect(screen.queryByTestId(GameScreenSelectors.TipsButton)).toBeNull();
    });

    it('hides the rating badge for a difficulty below Hell', async () => {
        await renderGameInputTools(DifficultyEnum.Nightmare, highSampleRating);

        expect(screen.queryByTestId(GameScreenSelectors.Rating)).toBeNull();
    });

    it('hides the rating badge for Hell when there is no rating yet', async () => {
        await renderGameInputTools(DifficultyEnum.Hell, 0);

        expect(screen.queryByTestId(GameScreenSelectors.Rating)).toBeNull();
    });

    it('shows the rating badge for Hell once the run is rated', async () => {
        await renderGameInputTools(DifficultyEnum.Hell, highSampleRating);

        expect(screen.getByTestId(GameScreenSelectors.Rating)).toBeTruthy();
        expect(screen.getByTestId(RatingBadgeSelectors.Root)).toBeTruthy();
    });

    it('shows the rating badge for Infinity once the run is rated', async () => {
        await renderGameInputTools(DifficultyEnum.Infinity, highSampleRating);

        expect(screen.getByTestId(GameScreenSelectors.Rating)).toBeTruthy();
    });

    it('opens the rating explainer when the badge is pressed', async () => {
        await renderGameInputTools(DifficultyEnum.Hell, highSampleRating);

        await fireEvent.press(screen.getByRole('button'));

        expect(mockPush).toHaveBeenCalledWith(getRatingExplainerHref(highSampleRating, false));
    });
});
