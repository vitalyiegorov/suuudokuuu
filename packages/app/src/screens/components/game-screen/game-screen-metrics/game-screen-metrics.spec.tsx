import { describe, expect, it } from '@jest/globals';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { screen } from '@testing-library/react-native';

import { getDifficultyText } from '../../../../@generic/utils/get-difficulty-text.util';
import { renderWithGameContext } from '../../../../@generic/utils/render-with-game-context.mock';
import { GameScreenSelectors } from '../game-screen.selectors';

import { GameScreenMetrics } from './game-screen-metrics';

const highSampleRating = 8.4;

const renderMetrics = (difficulty: DifficultyEnum, rating: number) =>
    renderWithGameContext(
        <GameScreenMetrics elapsedTime={90} hasTimer maxMistakes={3} maxMistakesReached={false} mistakes={1} score={42} />,
        { game: { difficulty, isRatingCeiling: false, rating } }
    );

describe('GameScreenMetrics', () => {
    it('shows the current difficulty on the Level item', async () => {
        await renderMetrics(DifficultyEnum.Hell, highSampleRating);

        expect(screen.getByTestId(GameScreenSelectors.Level)).toHaveTextContent(getDifficultyText(DifficultyEnum.Hell));
    });

    it('never renders a Rating item, even when the run carries a rated difficulty', async () => {
        await renderMetrics(DifficultyEnum.Hell, highSampleRating);

        expect(screen.queryByTestId(GameScreenSelectors.Rating)).toBeNull();
    });

    it('never renders a Rating item for an unrated difficulty', async () => {
        await renderMetrics(DifficultyEnum.Easy, 0);

        expect(screen.queryByTestId(GameScreenSelectors.Rating)).toBeNull();
    });
});
