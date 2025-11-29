import { useLingui } from '@lingui/react/macro';
import { LucideSwords } from 'lucide-react-native';
import { use } from 'react';

import { useShareChallenge } from '../../../game/hooks/use-share-challenge.hook';
import { ThemeContext } from '../../../theme/context/theme.context';
import { BlackButton } from '../black-button/black-button';

import { ChallengeFriendButtonStyles as styles } from './challenge-friend-button.styles';

export const ChallengeFriendButton = () => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const handleShareChallenge = useShareChallenge();

    return (
        <BlackButton onPress={handleShareChallenge} style={styles.button}>
            <LucideSwords color={theme.colors.white} size={16} style={styles.icon} />
            {t`Challenge a Friend`}
        </BlackButton>
    );
};
