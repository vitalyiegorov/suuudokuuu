import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { gamePauseAction } from '../store/game.actions';

import { usePauseGameOnSettingsFocus } from './use-pause-game-on-settings-focus.hook';

type FocusEffectCleanup = () => void;
type FocusEffect = () => FocusEffectCleanup | undefined;

let capturedFocusEffect: FocusEffect | undefined;
let mockHasStarted = false;
let mockIsPaused = false;

const mockUseFocusEffect = jest.fn();
const mockUseCallback = jest.fn((effect: FocusEffect) => effect);
const mockDispatch = jest.fn();
const mockGameIsStartedSelector = jest.fn(() => mockHasStarted);
const mockGamePausedSelector = jest.fn(() => mockIsPaused);

jest.mock('expo-router', () => ({
    useFocusEffect: (effect: FocusEffect) => {
        capturedFocusEffect = effect;
        mockUseFocusEffect(effect);
    }
}));

jest.mock('react', () => ({
    useCallback: (effect: FocusEffect) => mockUseCallback(effect)
}));

jest.mock('../../@generic/app-root.store', () => ({
    appRootStore: {
        getState: jest.fn(() => ({}))
    }
}));

jest.mock('../../@generic/hooks/use-app-dispatch.hook', () => ({
    useAppDispatch: () => mockDispatch
}));

jest.mock('../store/game.selectors', () => ({
    gameIsStartedSelector: () => mockGameIsStartedSelector(),
    gamePausedSelector: () => mockGamePausedSelector()
}));

describe('usePauseGameOnSettingsFocus', () => {
    beforeEach(() => {
        capturedFocusEffect = undefined;
        mockHasStarted = false;
        mockIsPaused = false;
        mockDispatch.mockClear();
        mockUseFocusEffect.mockClear();
        mockUseCallback.mockClear();
        mockGameIsStartedSelector.mockClear();
        mockGamePausedSelector.mockClear();
    });

    it('pauses the game each time settings opens without resuming on blur', () => {
        mockHasStarted = true;
        mockIsPaused = false;

        usePauseGameOnSettingsFocus();

        expect(mockUseFocusEffect).toHaveBeenCalledTimes(1);

        const firstCleanup = capturedFocusEffect?.();

        expect(mockDispatch).toHaveBeenCalledWith(gamePauseAction({ shouldShowPauseScreen: false }));
        expect(firstCleanup).toBeUndefined();

        mockIsPaused = false;
        mockDispatch.mockClear();

        const secondCleanup = capturedFocusEffect?.();

        expect(mockDispatch).toHaveBeenCalledWith(gamePauseAction({ shouldShowPauseScreen: false }));
        expect(secondCleanup).toBeUndefined();
    });
});
