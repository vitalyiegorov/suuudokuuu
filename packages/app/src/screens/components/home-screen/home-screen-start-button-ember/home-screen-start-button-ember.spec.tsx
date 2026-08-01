import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { I18nTestWrapper } from '../../../../@generic/mocks/i18n-test-wrapper.mock';

import { HomeScreenStartButtonEmber } from './home-screen-start-button-ember';
import { HomeScreenStartButtonEmberSelectors } from './home-screen-start-button-ember.selectors';
import { HomeScreenStartButtonEmberStyles } from './home-screen-start-button-ember.styles';

let mockReducedMotion = false;

const mockResolveUnistyleForAnimated = jest.fn((style: object) => style);

jest.mock('@suuudokuuu/ui', () => {
    const actualUi = jest.requireActual<typeof import('@suuudokuuu/ui')>('@suuudokuuu/ui');

    return {
        ...actualUi,
        resolveUnistyleForAnimated: (style: object) => mockResolveUnistyleForAnimated(style)
    };
});

jest.mock('react-native-reanimated', () => {
    const { View } = jest.requireActual<typeof import('react-native')>('react-native');

    return {
        __esModule: true,
        Easing: {
            bezier: (...values: number[]) => values,
            ease: (value: unknown) => value,
            inOut: (easing: unknown) => easing,
            quad: (value: unknown) => value
        },
        cancelAnimation: jest.fn(),
        default: { View, createAnimatedComponent: (component: unknown) => component },
        useAnimatedStyle: (factory: () => object) => factory(),
        useReducedMotion: () => mockReducedMotion,
        useSharedValue: (initialValue: unknown) => ({ value: initialValue }),
        withDelay: (_delayMs: number, animation: unknown) => animation,
        withRepeat: (animation: unknown) => animation,
        withSequence: (...animations: unknown[]) => animations.at(-1),
        withTiming: (toValue: unknown) => toValue
    };
});

const testID = 'home-screen-start-button-ember-test';

const renderEmberButton = () =>
    render(
        <HomeScreenStartButtonEmber isLoading={false} onPress={jest.fn()} style={undefined} testID={testID}>
            <Text>Start puzzle</Text>
        </HomeScreenStartButtonEmber>,
        { wrapper: I18nTestWrapper }
    );

describe('HomeScreenStartButtonEmber', () => {
    beforeEach(() => {
        mockReducedMotion = false;
        mockResolveUnistyleForAnimated.mockClear();
    });

    it('should render the animated ember variant by default', async () => {
        await renderEmberButton();

        expect(screen.getByTestId(HomeScreenStartButtonEmberSelectors.AnimatedRoot)).toBeTruthy();
        expect(screen.queryByTestId(HomeScreenStartButtonEmberSelectors.StaticRoot)).toBeNull();
        expect(screen.getByTestId(testID)).toBeTruthy();
    });

    it('should render the static ember variant when reduced motion is enabled', async () => {
        mockReducedMotion = true;

        await renderEmberButton();

        expect(screen.getByTestId(HomeScreenStartButtonEmberSelectors.StaticRoot)).toBeTruthy();
        expect(screen.queryByTestId(HomeScreenStartButtonEmberSelectors.AnimatedRoot)).toBeNull();
        expect(screen.getByTestId(testID)).toBeTruthy();
    });

    it.each([false, true])('should resolve every wrapper unistyle when reduced motion is %s', async isReducedMotion => {
        mockReducedMotion = isReducedMotion;

        await renderEmberButton();

        const resolvedStyles = mockResolveUnistyleForAnimated.mock.calls.map(([style]) => style);
        const expectedStyles = isReducedMotion
            ? [
                  HomeScreenStartButtonEmberStyles.emberWrapper,
                  HomeScreenStartButtonEmberStyles.emberGlow,
                  HomeScreenStartButtonEmberStyles.emberStaticGlow,
                  HomeScreenStartButtonEmberStyles.emberSheen
              ]
            : [
                  HomeScreenStartButtonEmberStyles.emberWrapper,
                  HomeScreenStartButtonEmberStyles.emberGlow,
                  HomeScreenStartButtonEmberStyles.emberSheen
              ];

        expect(resolvedStyles).toStrictEqual(expectedStyles);
    });
});
