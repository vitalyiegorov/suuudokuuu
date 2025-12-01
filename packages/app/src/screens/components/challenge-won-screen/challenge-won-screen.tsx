import { useLingui } from '@lingui/react/macro';
import { LucideTrophy } from 'lucide-react-native';

import { ChallengeBackButton } from '../../../challenge/components/challenge-back-button/challenge-back-button';
import { ChallengeResultScreen } from '../../../challenge/components/challenge-result-screen/challenge-result-screen';

export const ChallengeWonScreen = () => {
    const { t } = useLingui();

    return (
        <ChallengeResultScreen
            differenceLabel={t`faster!`}
            headerText={t`You won the challenge!`}
            icon={LucideTrophy}
            isWon={true}
        >
            <ChallengeBackButton />
        </ChallengeResultScreen>
    );
};
