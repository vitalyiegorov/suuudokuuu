import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { View } from 'react-native';

import { GameResultActionsLayout } from './game-result-actions-layout';

const childTestId = 'game-result-actions-layout-child';

describe('GameResultActionsLayout', () => {
    it('should render its children inside the action band', async () => {
        await render(
            <GameResultActionsLayout>
                <View testID={childTestId} />
            </GameResultActionsLayout>
        );

        expect(screen.getByTestId(childTestId)).toBeTruthy();
    });
});
