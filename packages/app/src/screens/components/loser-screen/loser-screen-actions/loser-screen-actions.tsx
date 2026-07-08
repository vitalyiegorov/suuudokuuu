import { useLingui } from '@lingui/react/macro';
import { LucideRotateCcw } from 'lucide-react-native';

import { AppLinkButton } from '../../../../@generic/components/app-link-button/app-link-button';
import { useAppDispatch } from '../../../../@generic/hooks/use-app-dispatch.hook';
import { gameResetAction } from '../../../../game/store/game.actions';
import { LoserScreenSelectors } from '../loser-screen.selectors';

import { LoserScreenActionsStyles as styles } from './loser-screen-actions.styles';

export const LoserScreenActions = () => {
    const { t } = useLingui();
    const dispatch = useAppDispatch();

    const handlePlayAgain = () => void dispatch(gameResetAction());

    return (
        <>
            <AppLinkButton
                href="/"
                icon={LucideRotateCcw}
                onPress={handlePlayAgain}
                replace
                size="large"
                style={styles.primaryButton}
                testID={LoserScreenSelectors.PlayAgainButton}
                text={t`Play again`}
                variant="primary"
            />

            <AppLinkButton
                href="/"
                onPress={handlePlayAgain}
                replace
                size="large"
                style={styles.secondaryButton}
                testID={LoserScreenSelectors.BackHomeButton}
                text={t`Back to home`}
                variant="ghost"
            />
        </>
    );
};
