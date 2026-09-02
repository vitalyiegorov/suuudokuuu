import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import LucideFlag from 'lucide-react-native/icons/flag';
import LucideHeartCrack from 'lucide-react-native/icons/heart-crack';
import LucideTrophy from 'lucide-react-native/icons/trophy';
import { use, useEffect } from 'react';
import { View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';

import { CelebrationPulse } from '../../../@generic/components/celebration-pulse/celebration-pulse';
import { useReduceMotion } from '../../../@generic/hooks/use-reduce-motion.hook';
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

    const isMotionReduced = useReduceMotion();

    const appear = useSharedValue(0);

    useEffect(() => {
        appear.value = isMotionReduced ? 1 : withSpring(1, { damping: 12, stiffness: 160 });
    }, [isMotionReduced, appear]);

    const appearScale = useDerivedValue(() => interpolate(appear.value, AppearInput, AppearScaleOutput));
    const appearAnimatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: appearScale.value }] }));

    let Icon = LucideFlag;
    let iconColor = theme.colors.inkText;
    if (result === ChallengeResult.Won) {
        Icon = LucideTrophy;
    }
    if (result === ChallengeResult.Lost) {
        Icon = LucideHeartCrack;
        iconColor = theme.colors.danger;
    }

    const medalStyle = [resolveUnistyleForAnimated(styles.medal), { backgroundColor: theme.colors.ink }];
    const medal = (
        <View style={medalStyle}>
            <Icon color={iconColor} size={IconSize} strokeWidth={1.8} />
        </View>
    );

    if (result === ChallengeResult.Won) {
        return (
            <View style={styles.wrap}>
                <CelebrationPulse color={theme.colors.ink} size={MedallionSize}>
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
