import { useIsFocused } from 'expo-router';
import { useEffect } from 'react';

import { emptyFn } from '@rnw-community/shared';

import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { gameIsChallengeRunSelector } from '../../store/game.selectors';
import { useGameHistoryControls } from '../use-game-history-controls.hook';

import type { FieldEngine } from '@suuudokuuu/field-core';

const isHistoryShortcut = (event: KeyboardEvent): boolean => event.code === 'KeyZ' && (event.metaKey || event.ctrlKey);

export const useHistoryShortcut = (engine: FieldEngine) => {
    const isFocused = useIsFocused();
    const isChallengeRun = useAppSelector(gameIsChallengeRunSelector);
    const { handleUndo, handleRedo } = useGameHistoryControls(engine);
    const canUseHistoryControls = isFocused && !isChallengeRun;

    useEffect(() => {
        if (!canUseHistoryControls) {
            return emptyFn;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isHistoryShortcut(event)) {
                return;
            }

            event.preventDefault();

            const applyHistoryStep = event.shiftKey ? handleRedo : handleUndo;

            applyHistoryStep();
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => void window.removeEventListener('keydown', handleKeyDown);
    }, [canUseHistoryControls, handleRedo, handleUndo]);
};
