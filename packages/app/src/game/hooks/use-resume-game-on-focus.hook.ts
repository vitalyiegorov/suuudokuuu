import { useIsFocused } from 'expo-router';
import { useEffect, useRef } from 'react';

import { useAppDispatch } from '../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../@generic/hooks/use-app-selector.hook';
import { gameResumeAction } from '../store/game.actions';
import { gameIsStartedSelector, gamePausedSelector, gameShouldResumeOnFocusSelector } from '../store/game.selectors';

export const useResumeGameOnFocus = () => {
    const dispatch = useAppDispatch();
    const hasStarted = useAppSelector(gameIsStartedSelector);
    const isPaused = useAppSelector(gamePausedSelector);
    const shouldResumeOnFocus = useAppSelector(gameShouldResumeOnFocusSelector);
    const isFocused = useIsFocused();
    const wasFocusedRef = useRef(isFocused);

    useEffect(() => {
        const didBecomeFocused = isFocused && !wasFocusedRef.current;
        wasFocusedRef.current = isFocused;

        if (didBecomeFocused && hasStarted && isPaused && shouldResumeOnFocus) {
            dispatch(gameResumeAction());
        }
    }, [dispatch, hasStarted, isFocused, isPaused, shouldResumeOnFocus]);
};
