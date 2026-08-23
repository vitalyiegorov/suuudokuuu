import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { screen } from '@testing-library/react-native';

import { renderWithGameContext } from '../../../../@generic/utils/render-with-game-context.mock';
import { HintButtonSelectors } from '../../../../game/components/hint-button/hint-button.selectors';
import { InputModeButtonSelectors } from '../../../../game/components/input-mode-button/input-mode-button.selectors';
import { RedoButtonSelectors } from '../../../../game/components/redo-button/redo-button.selectors';
import { UndoButtonSelectors } from '../../../../game/components/undo-button/undo-button.selectors';
import { GameScreenSelectors } from '../game-screen.selectors';

import { GameInputTools } from './game-input-tools';

const highSampleRating = 8.4;

const renderGameInputTools = (hideAutoCandidates = false) =>
    renderWithGameContext(<GameInputTools hideAutoCandidates={hideAutoCandidates} />, {
        game: { difficulty: DifficultyEnum.Easy, isRatingCeiling: false, rating: 0 }
    });

describe('GameInputTools', () => {
    it('renders the pencil and auto-candidates buttons', async () => {
        await renderGameInputTools();

        expect(screen.getByTestId(InputModeButtonSelectors.Root)).toBeTruthy();
        expect(screen.getByTestId(GameScreenSelectors.TipsButton)).toBeTruthy();
    });

    it('renders the undo, redo and hint buttons for a solo run', async () => {
        await renderGameInputTools();

        expect(screen.getByTestId(UndoButtonSelectors.Root)).toBeTruthy();
        expect(screen.getByTestId(RedoButtonSelectors.Root)).toBeTruthy();
        expect(screen.getByTestId(HintButtonSelectors.Root)).toBeTruthy();
    });

    it('hides the undo, redo and hint buttons during a challenge run', async () => {
        await renderWithGameContext(<GameInputTools hideAutoCandidates={false} />, {
            game: { difficulty: DifficultyEnum.Easy, isChallengeRun: true, isRatingCeiling: false, rating: 0 }
        });

        expect(screen.queryByTestId(UndoButtonSelectors.Root)).toBeNull();
        expect(screen.queryByTestId(RedoButtonSelectors.Root)).toBeNull();
        expect(screen.queryByTestId(HintButtonSelectors.Root)).toBeNull();
    });

    it('hides the hint button on the hardest difficulties while keeping undo and redo', async () => {
        await renderWithGameContext(<GameInputTools hideAutoCandidates={false} />, {
            game: { difficulty: DifficultyEnum.Nightmare, isRatingCeiling: false, rating: 0 }
        });

        expect(screen.queryByTestId(HintButtonSelectors.Root)).toBeNull();
        expect(screen.getByTestId(UndoButtonSelectors.Root)).toBeTruthy();
    });

    it('restores the hint button on the hardest difficulties when the player opts in', async () => {
        await renderWithGameContext(<GameInputTools hideAutoCandidates={false} />, {
            game: { difficulty: DifficultyEnum.Hell, isRatingCeiling: false, rating: 0 },
            settings: { allowHintsOnHardDifficulties: true }
        });

        expect(screen.getByTestId(HintButtonSelectors.Root)).toBeTruthy();
    });

    it('hides the auto-candidates button when asked to', async () => {
        await renderGameInputTools(true);

        expect(screen.queryByTestId(GameScreenSelectors.TipsButton)).toBeNull();
    });

    it('never renders a rating badge, even for a rated Hell run', async () => {
        await renderWithGameContext(<GameInputTools hideAutoCandidates={false} />, {
            game: { difficulty: DifficultyEnum.Hell, isRatingCeiling: false, rating: highSampleRating }
        });

        expect(screen.queryByTestId(GameScreenSelectors.Rating)).toBeNull();
    });

    it('never renders a rating badge, even for a rated Infinity run', async () => {
        await renderWithGameContext(<GameInputTools hideAutoCandidates={false} />, {
            game: { difficulty: DifficultyEnum.Infinity, isRatingCeiling: true, rating: highSampleRating }
        });

        expect(screen.queryByTestId(GameScreenSelectors.Rating)).toBeNull();
    });
});
