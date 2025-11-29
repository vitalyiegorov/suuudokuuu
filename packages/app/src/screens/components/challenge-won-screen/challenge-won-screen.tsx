import { useLingui } from '@lingui/react/macro';
import { LucideTrophy } from 'lucide-react-native';

import { ChallengeResultScreen } from '../challenge-result-screen/challenge-result-screen';

export const ChallengeWonScreen = () => {
    const { t } = useLingui();

    return (
        <ChallengeResultScreen
            differenceLabel={t`faster!`}
            headerText={t`You won the challenge!`}
            icon={LucideTrophy}
            isWon={true}
        />
    );
};
