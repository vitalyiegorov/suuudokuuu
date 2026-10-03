import { CurrentRunService } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import LucideHouse from 'lucide-react-native/icons/house';
import { use } from 'react';

import { GlassIconButton } from '../../../@generic/components/glass-icon-button/glass-icon-button';
import { appRuntime } from '../../../@generic/runtime/app.runtime';
import { ThemeContext } from '../../../theme/context/theme.context';
import { ChallengeResultFooterSelectors } from '../challenge-result-footer/challenge-result-footer.selectors';

export const ChallengeResultHomeButton = () => {
    const { theme } = use(ThemeContext);

    const handleGoHome = () => void appRuntime.runPromise(Effect.flatMap(CurrentRunService, currentRunService => currentRunService.reset));

    return (
        <GlassIconButton href="/" onPress={handleGoHome} replace testID={ChallengeResultFooterSelectors.HomeButton}>
            <LucideHouse color={theme.colors.inkText} />
        </GlassIconButton>
    );
};
