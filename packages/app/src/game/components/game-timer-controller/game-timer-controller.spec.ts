import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { AppState } from 'react-native';

import { gamePauseAction, gameResumeAction, gameTickAction } from '../../store/game.actions';

import { GameTimerController } from './game-timer-controller';

type FocusEffectCleanup = () => void;
type FocusEffect = () => FocusEffectCleanup | undefined;

let capturedFocusEffect: FocusEffect | undefined;
let mockHasStarted = false;
let mockIsPaused = false;
let mockShouldResumeOnFocus = false;
let mockAppStateChangeListener: ((nextAppState: string) => void) | undefined;

const mockUseFocusEffect = jest.fn();
const mockUseCallback = jest.fn((effect: FocusEffect) => effect);
const mockUseRef = jest.fn((initialValue: unknown) => ({ current: initialValue }));
const mockDispatch = jest.fn((action: { type: string }) => {
    if (action.type === gamePauseAction.type) {
        mockIsPaused = true;
        mockShouldResumeOnFocus = true;
    }

    if (action.type === gameResumeAction.type) {
        mockIsPaused = false;
        mockShouldResumeOnFocus = false;
    }
});
const mockSubscriptionRemove = jest.fn();
const mockAddEventListener = jest.fn((_eventName: 'change', listener: (nextAppState: string) => void) => {
    mockAppStateChangeListener = listener;

    return {
        remove: mockSubscriptionRemove
    };
});
const mockReplace = jest.fn();
const mockGameIsStartedSelector = jest.fn(() => mockHasStarted);
const mockGamePausedSelector = jest.fn(() => mockIsPaused);
const mockGameShouldResumeOnFocusSelector = jest.fn(() => mockShouldResumeOnFocus);

jest.mock('expo-router', () => ({
    useFocusEffect: (effect: FocusEffect) => {
        capturedFocusEffect = effect;
        mockUseFocusEffect(effect);
    },
    useRouter: () => ({
        replace: mockReplace
    })
}));

jest.mock('react', () => ({
    useCallback: (effect: FocusEffect) => mockUseCallback(effect),
    useRef: (initialValue: unknown) => mockUseRef(initialValue)
}));

jest.mock('react-native', () => ({
    AppState: {
        addEventListener: mockAddEventListener
    }
}));

jest.mock('../../../@generic/app-root.store', () => ({
    appRootStore: {
        getState: jest.fn(() => ({}))
    }
}));

jest.mock('../../../@generic/hooks/use-app-dispatch.hook', () => ({
    useAppDispatch: () => mockDispatch
}));

jest.mock('../../store/game.selectors', () => ({
    gameIsStartedSelector: () => mockGameIsStartedSelector(),
    gamePausedSelector: () => mockGamePausedSelector(),
    gameShouldResumeOnFocusSelector: () => mockGameShouldResumeOnFocusSelector()
}));

describe('GameTimerController', () => {
    beforeEach(() => {
        capturedFocusEffect = undefined;
        mockAppStateChangeListener = undefined;
        mockHasStarted = true;
        mockIsPaused = false;
        mockShouldResumeOnFocus = false;
        Reflect.set(AppState, 'addEventListener', mockAddEventListener);
        jest.useFakeTimers();
        mockDispatch.mockClear();
        mockUseFocusEffect.mockClear();
        mockUseCallback.mockClear();
        mockUseRef.mockClear();
        mockAddEventListener.mockClear();
        mockSubscriptionRemove.mockClear();
        mockReplace.mockClear();
        mockGameIsStartedSelector.mockClear();
        mockGamePausedSelector.mockClear();
        mockGameShouldResumeOnFocusSelector.mockClear();
    });

    it('resumes only when the game route regains focus, even across two settings round trips', () => {
        GameTimerController();

        expect(mockUseFocusEffect).toHaveBeenCalledTimes(1);

        const firstFocusCleanup = capturedFocusEffect?.();

        expect(mockDispatch).not.toHaveBeenCalledWith(gameResumeAction());
        expect(mockAddEventListener).toHaveBeenCalledTimes(1);

        mockDispatch.mockClear();
        mockDispatch(gamePauseAction({ shouldShowPauseScreen: false }));

        firstFocusCleanup?.();

        expect(mockDispatch).not.toHaveBeenCalledWith(gameResumeAction());

        const secondFocusCleanup = capturedFocusEffect?.();

        expect(mockDispatch).toHaveBeenCalledWith(gameResumeAction());

        mockDispatch.mockClear();
        mockDispatch(gamePauseAction({ shouldShowPauseScreen: false }));

        secondFocusCleanup?.();

        expect(mockDispatch).not.toHaveBeenCalledWith(gameResumeAction());

        const thirdFocusCleanup = capturedFocusEffect?.();

        expect(mockDispatch).toHaveBeenCalledWith(gameResumeAction());

        thirdFocusCleanup?.();

        jest.useRealTimers();
    });

    it('ticks while focused, pauses and replaces on background once, and cleans up the timer listener', () => {
        GameTimerController();

        const focusCleanup = capturedFocusEffect?.();

        jest.advanceTimersByTime(1000);

        expect(mockDispatch).toHaveBeenCalledWith(gameTickAction());
        expect(mockAddEventListener).toHaveBeenCalledTimes(1);

        mockDispatch.mockClear();

        mockAppStateChangeListener?.('background');

        expect(mockDispatch).toHaveBeenCalledWith(gamePauseAction());
        expect(mockReplace).toHaveBeenCalledWith('/pause');
        expect(mockSubscriptionRemove).not.toHaveBeenCalled();

        mockDispatch.mockClear();
        mockReplace.mockClear();

        mockAppStateChangeListener?.('inactive');
        mockAppStateChangeListener?.('background');
        mockAppStateChangeListener?.('active');

        expect(mockDispatch).not.toHaveBeenCalledWith(gamePauseAction());
        expect(mockReplace).not.toHaveBeenCalled();

        focusCleanup?.();

        expect(mockSubscriptionRemove).toHaveBeenCalledTimes(1);

        jest.useRealTimers();
    });
});
