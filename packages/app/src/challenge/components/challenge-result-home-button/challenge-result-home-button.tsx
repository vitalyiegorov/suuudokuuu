import { useLingui } from '@lingui/react/macro';

import { GameResultHomeButton } from '../../../@generic/components/game-result-home-button/game-result-home-button';
import { runCurrentRunCommand } from '../../../game/utils/run-current-run-command.util';
import { ChallengeResultFooterSelectors } from '../challenge-result-footer/challenge-result-footer.selectors';

export const ChallengeResultHomeButton = () => {
    const { t } = useLingui();

    const handleGoHome = () => void runCurrentRunCommand(currentRunService => currentRunService.reset);

    return <GameResultHomeButton accessibilityLabel={t`Home`} onPress={handleGoHome} testID={ChallengeResultFooterSelectors.HomeButton} />;
};
