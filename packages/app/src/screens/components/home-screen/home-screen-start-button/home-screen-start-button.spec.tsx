import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { HomeScreenStartButton } from './home-screen-start-button';

import type { ReactNode } from 'react';

const testID = 'home-screen-start-button-test';
const emberMockTestId = 'home-screen-start-button-ember-mock';
const shimmerMockTestId = 'home-screen-start-button-shimmer-mock';

interface EmberMockProps {
    readonly testID: string;
}

interface ShimmerMockProps {
    readonly children: ReactNode;
}

jest.mock('../home-screen-start-button-ember/home-screen-start-button-ember', () => {
    const { Text: MockText } = jest.requireActual<typeof import('react-native')>('react-native');

    return {
        HomeScreenStartButtonEmber: ({ testID: emberTestId }: EmberMockProps) => <MockText testID={emberMockTestId}>{emberTestId}</MockText>
    };
});

jest.mock('../home-screen-start-button-shimmer/home-screen-start-button-shimmer', () => {
    const { View: MockView } = jest.requireActual<typeof import('react-native')>('react-native');

    return {
        HomeScreenStartButtonShimmer: ({ children }: ShimmerMockProps) => <MockView testID={shimmerMockTestId}>{children}</MockView>
    };
});

const renderStartButton = (isHellSelected: boolean, isInfinitySelected: boolean) =>
    render(
        <HomeScreenStartButton
            isHellSelected={isHellSelected}
            isInfinitySelected={isInfinitySelected}
            isLoading={false}
            onPress={jest.fn()}
            style={undefined}
            testID={testID}
        >
            <Text>Start puzzle</Text>
        </HomeScreenStartButton>
    );

describe('HomeScreenStartButton', () => {
    it('should render the standard button when neither Hell nor Infinity is selected', async () => {
        await renderStartButton(false, false);

        expect(screen.getByTestId(testID)).toBeTruthy();
        expect(screen.queryByTestId(emberMockTestId)).toBeNull();
        expect(screen.queryByTestId(shimmerMockTestId)).toBeNull();
    });

    it('should render the ember button when Hell is selected', async () => {
        await renderStartButton(true, false);

        expect(screen.getByTestId(emberMockTestId)).toBeTruthy();
    });

    it('should render the shimmer-wrapped button when Infinity is selected', async () => {
        await renderStartButton(false, true);

        expect(screen.getByTestId(shimmerMockTestId)).toBeTruthy();
        expect(screen.getByTestId(testID)).toBeTruthy();
    });
});
