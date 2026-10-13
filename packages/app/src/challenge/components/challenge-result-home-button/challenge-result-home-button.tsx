import { useLingui } from '@lingui/react/macro';

import { emptyFn } from '@rnw-community/shared';

import { GameResultHomeButton } from '../../../@generic/components/game-result-home-button/game-result-home-button';
import { runCurrentRunCommand } from '../../../game/utils/run-current-run-command.util';
import { ChallengeResultFooterSelectors } from '../challenge-result-footer/challenge-result-footer.selectors';

export const ChallengeResultHomeButton = () => {
    const { t } = useLingui();

    const handleGoHome = () => void runCurrentRunCommand(currentRunService => currentRunService.reset).catch(emptyFn);

    return <GameResultHomeButton accessibilityLabel={t`Home`} onPress={handleGoHome} testID={ChallengeResultFooterSelectors.HomeButton} />;
};
