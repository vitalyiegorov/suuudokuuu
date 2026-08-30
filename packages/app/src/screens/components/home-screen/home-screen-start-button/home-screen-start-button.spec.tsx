import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { HomeScreenStartButton } from './home-screen-start-button';

const testID = 'home-screen-start-button-test';
const emberMockTestId = 'home-screen-start-button-ember-mock';

interface EmberMockProps {
    readonly color: string;
    readonly testID: string;
}

jest.mock('../home-screen-start-button-ember/home-screen-start-button-ember', () => {
    const { Text: MockText } = jest.requireActual<typeof import('react-native')>('react-native');

    return {
        HomeScreenStartButtonEmber: ({ color, testID: emberTestId }: EmberMockProps) => (
            <MockText testID={emberMockTestId}>{`${emberTestId}:${color}`}</MockText>
        )
    };
});

const renderStartButton = (color: string | null) =>
    render(
        <HomeScreenStartButton color={color} isLoading={false} onPress={jest.fn()} style={undefined} testID={testID}>
            <Text>Start puzzle</Text>
        </HomeScreenStartButton>
    );

describe('HomeScreenStartButton', () => {
    it('should render the standard button when no special color is selected', async () => {
        await renderStartButton(null);

        expect(screen.getByTestId(testID)).toBeTruthy();
        expect(screen.queryByTestId(emberMockTestId)).toBeNull();
    });

    it('should render the ember button with the selected color', async () => {
        const color = '#123456';

        await renderStartButton(color);

        expect(screen.getByTestId(emberMockTestId)).toBeTruthy();
        expect(screen.getByText(`${testID}:${color}`)).toBeTruthy();
    });
});
