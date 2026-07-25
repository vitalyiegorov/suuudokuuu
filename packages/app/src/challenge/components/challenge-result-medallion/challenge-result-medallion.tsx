import { LucideFlag, LucideHeartCrack, LucideTrophy } from 'lucide-react-native';
import { use, useEffect } from 'react';
import { View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';

import { CelebrationPulse } from '../../../@generic/components/celebration-pulse/celebration-pulse';
import { resolveUnistyleForAnimated } from '../../../@generic/utils/resolve-unistyle-for-animated.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { ChallengeResult } from '../../interfaces/challenge-result.interface';

import { ChallengeResultMedallionStyles as styles } from './challenge-result-medallion.styles';

const MedallionSize = 92;
const AppearInput = [0, 1];
const AppearScaleOutput = [0.5, 1];
const IconSize = 42;

interface Props {
    readonly result: ChallengeResult;
}

export const ChallengeResultMedallion = ({ result }: Props) => {
    const { theme } = use(ThemeContext);

    const appear = useSharedValue(0);

    useEffect(() => {
        appear.value = withSpring(1, { damping: 12, stiffness: 160 });
    }, [appear]);

    const appearScale = useDerivedValue(() => interpolate(appear.value, AppearInput, AppearScaleOutput));
    const appearAnimatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: appearScale.value }] }));

    let Icon = LucideFlag;
    let iconColor = theme.colors.label.inverted;
    if (result === ChallengeResult.Won) {
        Icon = LucideTrophy;
    }
    if (result === ChallengeResult.Lost) {
        Icon = LucideHeartCrack;
        iconColor = theme.colors.red;
    }

    const medalStyle = [resolveUnistyleForAnimated(styles.medal), { backgroundColor: theme.colors.black }];
    const medal = (
        <View style={medalStyle}>
            <Icon color={iconColor} size={IconSize} strokeWidth={1.8} />
        </View>
    );

    if (result === ChallengeResult.Won) {
        return (
            <View style={styles.wrap}>
                <CelebrationPulse color={theme.colors.black} size={MedallionSize}>
                    {medal}
                </CelebrationPulse>
            </View>
        );
    }

    return (
        <View style={styles.wrap}>
            <Animated.View style={appearAnimatedStyle}>{medal}</Animated.View>
        </View>
    );
};
