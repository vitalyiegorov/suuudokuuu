import { useLingui } from '@lingui/react/macro';
import { CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import LucideUser from 'lucide-react-native/icons/user';
import { use } from 'react';
import { Text, View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';

import { ChallengeRaceStatusStyles as styles } from './challenge-race-status.styles';

const AVATAR_ICON_SIZE = 16;
const LEAD_MARGIN = 0.02;
const NEUTRAL_STATUS_OPACITY = 0.6;
const LEADER_STATUS_OPACITY = 1;

interface Props {
    readonly opponentProgress: number;
    readonly playerProgress: number;
}

export const ChallengeRaceStatus = ({ opponentProgress, playerProgress }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const isPlayerLeading = playerProgress > opponentProgress + LEAD_MARGIN;
    const isRivalAhead = opponentProgress > playerProgress + LEAD_MARGIN;
    const hasLeader = isPlayerLeading || isRivalAhead;
    const leadingColor = isPlayerLeading ? theme.colors.text.primary : theme.colors.danger;
    const statusColor = hasLeader ? leadingColor : theme.colors.text.primary;
    const statusOpacity = hasLeader ? LEADER_STATUS_OPACITY : NEUTRAL_STATUS_OPACITY;
    const neutralStatusText = isRivalAhead ? t`is ahead` : t`neck & neck`;
    const statusText = isPlayerLeading ? t`you lead` : neutralStatusText;

    const avatarStyle = [styles.avatar, { backgroundColor: theme.colors.overlayLight }];
    const nameStyle = [styles.name, { color: theme.colors.text.primary }];
    const statusStyle = [styles.status, { color: statusColor, opacity: statusOpacity }];

    return (
        <View style={styles.container}>
            <View style={avatarStyle}>
                <LucideUser color={theme.colors.text.primary} size={AVATAR_ICON_SIZE} strokeWidth={2.2} />
            </View>
            <Text maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant} style={nameStyle}>
                {t`Rival`}
            </Text>
            <Text maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant} style={statusStyle}>
                {statusText}
            </Text>
        </View>
    );
};
