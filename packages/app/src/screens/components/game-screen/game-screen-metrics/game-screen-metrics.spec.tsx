import { describe, expect, it } from '@jest/globals';
import { screen } from '@testing-library/react-native';

import { renderWithGameContext } from '../../../../@generic/utils/render-with-game-context.mock';
import { GameScreenSelectors } from '../game-screen.selectors';

import { GameScreenMetrics } from './game-screen-metrics';

const renderMetrics = () =>
    renderWithGameContext(
        <GameScreenMetrics elapsedTime={90} hasTimer maxMistakes={3} maxMistakesReached={false} mistakes={1} score={42} />
    );

describe('GameScreenMetrics', () => {
    it('never renders a Level item', async () => {
        await renderMetrics();

        expect(screen.queryByTestId(GameScreenSelectors.Level)).toBeNull();
    });

    it('never renders a Rating item', async () => {
        await renderMetrics();

        expect(screen.queryByTestId(GameScreenSelectors.Rating)).toBeNull();
    });

    it('shows the elapsed time and score', async () => {
        await renderMetrics();

        expect(screen.getByTestId(GameScreenSelectors.Time)).toBeTruthy();
        expect(screen.getByTestId(GameScreenSelectors.Score)).toHaveTextContent('42');
    });
});
