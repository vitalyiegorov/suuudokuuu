import { LucideHouse } from 'lucide-react-native';
import { use } from 'react';

import { GlassIconButton } from '../../../@generic/components/glass-icon-button/glass-icon-button';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { gameResetAction } from '../../../game/store/game.actions';
import { ThemeContext } from '../../../theme/context/theme.context';
import { ChallengeResultFooterSelectors } from '../challenge-result-footer/challenge-result-footer.selectors';

export const ChallengeResultHomeButton = () => {
    const { theme } = use(ThemeContext);

    const dispatch = useAppDispatch();

    const handleGoHome = () => void dispatch(gameResetAction());

    return (
        <GlassIconButton href="/" onPress={handleGoHome} replace testID={ChallengeResultFooterSelectors.HomeButton}>
            <LucideHouse color={theme.colors.inkText} />
        </GlassIconButton>
    );
};
