import { Trans } from '@lingui/react/macro';
import { LucideRotateCcw } from 'lucide-react-native';
import { use } from 'react';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { gameLoadAction, gameResumeAction } from '../../../game/store/game.actions';
import { initialGameState } from '../../../game/store/game.state';
import { ThemeContext } from '../../../theme/context/theme.context';
import { ChallengeFriendButtonStyles as styles } from '../challenge-friend-button/challenge-friend-button.styles';

import type { GameState } from '../../../game/store/game.state';

interface Props {
    readonly gameState: GameState;
}

const getOriginalSudokuString = (sudokuString: string, solutionSteps: GameState['solutionSteps']): string => {
    const chars = sudokuString.split('');

    for (const step of solutionSteps) {
        chars[step.cellIndex] = '.';
    }

    return chars.join('');
};

export const TryAgainButton = ({ gameState }: Props) => {
    const { theme } = use(ThemeContext);
    const dispatch = useAppDispatch();

    const handleTryAgain = () => {
        const originalSudokuString = getOriginalSudokuString(gameState.sudokuString, gameState.solutionSteps);

        const newState: Partial<GameState> = {
            ...initialGameState,
            sudokuString: originalSudokuString,
            maxMistakes: gameState.maxMistakes,
            isChallengeMode: true,
            opponentSteps: gameState.opponentSteps,
            opponentTotalTime: gameState.opponentTotalTime
        };

        dispatch(gameLoadAction(newState));
        dispatch(gameResumeAction());
    };

    return (
        <BlackButton href="/game" onPress={handleTryAgain} replace style={styles.button}>
            <LucideRotateCcw color={theme.colors.white} size={16} style={styles.icon} />
            <Trans>Try Again</Trans>
        </BlackButton>
    );
};
