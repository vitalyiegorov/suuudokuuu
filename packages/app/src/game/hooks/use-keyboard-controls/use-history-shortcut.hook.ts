import { useIsFocused } from 'expo-router';
import { useEffect } from 'react';

import { emptyFn } from '@rnw-community/shared';

import { useCurrentRun } from '../../query/use-current-run.query';
import { gameGetHistoryControls } from '../../utils/game-get-history-controls.util';

import type { FieldEngine } from '@suuudokuuu/field-core';

const isHistoryShortcut = (event: KeyboardEvent): boolean => event.code === 'KeyZ' && (event.metaKey || event.ctrlKey);

export const useHistoryShortcut = (engine: FieldEngine) => {
    const isFocused = useIsFocused();
    const { isChallengeRun } = useCurrentRun();
    const { handleUndo, handleRedo } = gameGetHistoryControls(engine);
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
