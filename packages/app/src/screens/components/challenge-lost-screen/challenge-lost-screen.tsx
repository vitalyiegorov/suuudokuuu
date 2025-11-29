import { useLingui } from '@lingui/react/macro';
import { LucideHeartCrack } from 'lucide-react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ChallengeResultScreen } from '../challenge-result-screen/challenge-result-screen';
import { ChallengeResultScreenStyles as styles } from '../challenge-result-screen/challenge-result-screen.styles';

export const ChallengeLostScreen = () => {
    const { t } = useLingui();

    const extraContent = <BlackText style={styles.messageText}>{t`Better luck next time!`}</BlackText>;

    return (
        <ChallengeResultScreen
            differenceLabel={t`slower`}
            extraContent={extraContent}
            headerText={t`Challenge lost!`}
            icon={LucideHeartCrack}
            isWon={false}
        />
    );
};
