import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { HomeScreenStartButton } from './home-screen-start-button';

const testID = 'home-screen-start-button-test';
const emberMockTestId = 'home-screen-start-button-ember-mock';

interface EmberMockProps {
    readonly testID: string;
}

jest.mock('../home-screen-start-button-ember/home-screen-start-button-ember', () => {
    const { Text: MockText } = jest.requireActual<typeof import('react-native')>('react-native');

    return {
        HomeScreenStartButtonEmber: ({ testID: emberTestId }: EmberMockProps) => <MockText testID={emberMockTestId}>{emberTestId}</MockText>
    };
});

describe('HomeScreenStartButton', () => {
    it('should render the standard button when Hell is not selected', async () => {
        await render(
            <HomeScreenStartButton isHellSelected={false} isLoading={false} onPress={jest.fn()} style={undefined} testID={testID}>
                <Text>Start puzzle</Text>
            </HomeScreenStartButton>
        );

        expect(screen.getByTestId(testID)).toBeTruthy();
        expect(screen.queryByTestId(emberMockTestId)).toBeNull();
    });

    it('should render the ember button when Hell is selected', async () => {
        await render(
            <HomeScreenStartButton isHellSelected isLoading={false} onPress={jest.fn()} style={undefined} testID={testID}>
                <Text>Start puzzle</Text>
            </HomeScreenStartButton>
        );

        expect(screen.getByTestId(emberMockTestId)).toBeTruthy();
    });
});
