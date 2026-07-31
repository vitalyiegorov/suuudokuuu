import { useLingui } from '@lingui/react/macro';
import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { Zap } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useUnistyles } from 'react-native-unistyles';

import { BlackText } from '../../../@generic/components/black-text/black-text';

import { ChallengeConditionsRowSelectors } from './challenge-conditions-row.selectors';
import { ChallengeConditionsRowStyles as styles } from './challenge-conditions-row.styles';

const GlyphSize = 12;
const EnterDurationMs = 220;
const ExitDurationMs = 140;

export const ChallengeConditionsRow = () => {
    const { t } = useLingui();
    const { theme } = useUnistyles();

    const rowStyles = resolveUnistyleForAnimated(styles.row);
    const textStyles = [styles.text, { color: theme.colors.text.primary }];
    const conditions = [t`no pause`, t`recorded`, t`shareable`].join(' · ');

    return (
        <Animated.View
            entering={FadeIn.duration(EnterDurationMs)}
            exiting={FadeOut.duration(ExitDurationMs)}
            style={rowStyles}
            testID={ChallengeConditionsRowSelectors.Root}
        >
            <Zap color={theme.colors.text.primary} fill={theme.colors.text.primary} size={GlyphSize} strokeWidth={2.4} />

            <BlackText numberOfLines={1} style={textStyles}>
                {conditions}
            </BlackText>
        </Animated.View>
    );
};
