import { useLingui } from '@lingui/react/macro';
import { LucideUser } from 'lucide-react-native';
import { use } from 'react';
import { Text, View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';

import { ChallengeRaceStatusStyles as styles } from './challenge-race-status.styles';

const AVATAR_ICON_SIZE = 16;
const LEAD_MARGIN = 0.02;

interface Props {
    readonly opponentProgress: number;
    readonly playerProgress: number;
}

export const ChallengeRaceStatus = ({ opponentProgress, playerProgress }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const isPlayerLeading = playerProgress > opponentProgress + LEAD_MARGIN;
    const isRivalAhead = opponentProgress > playerProgress + LEAD_MARGIN;
    const leadingColor = isPlayerLeading ? theme.colors.blue : theme.colors.red;
    const statusColor = isPlayerLeading || isRivalAhead ? leadingColor : theme.colors.label.hint;
    const neutralStatusText = isRivalAhead ? t`is ahead` : t`neck & neck`;
    const statusText = isPlayerLeading ? t`you lead` : neutralStatusText;

    const avatarStyle = [styles.avatar, { backgroundColor: theme.colors.white05 }];
    const nameStyle = [styles.name, { color: theme.colors.label.inverted }];
    const statusStyle = [styles.status, { color: statusColor }];

    return (
        <View style={styles.container}>
            <View style={avatarStyle}>
                <LucideUser color={theme.colors.label.inverted} size={AVATAR_ICON_SIZE} strokeWidth={2.2} />
            </View>
            <Text allowFontScaling={false} style={nameStyle}>
                {t`Rival`}
            </Text>
            <Text allowFontScaling={false} style={statusStyle}>
                {statusText}
            </Text>
        </View>
    );
};
