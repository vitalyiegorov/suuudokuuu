import { Trans } from '@lingui/react/macro';
import { LucideRotateCcw } from 'lucide-react-native';
import { use } from 'react';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { gameRetryChallengeAction } from '../../../game/store/game.actions';
import { ThemeContext } from '../../../theme/context/theme.context';
import { ChallengeFriendButtonStyles as styles } from '../challenge-friend-button/challenge-friend-button.styles';

export const TryAgainButton = () => {
    const { theme } = use(ThemeContext);
    const dispatch = useAppDispatch();

    const handleTryAgain = () => {
        dispatch(gameRetryChallengeAction());
    };

    return (
        <BlackButton href="/game" onPress={handleTryAgain} replace style={styles.button}>
            <LucideRotateCcw color={theme.colors.white} size={16} style={styles.icon} />
            <Trans>Try Again</Trans>
        </BlackButton>
    );
};
