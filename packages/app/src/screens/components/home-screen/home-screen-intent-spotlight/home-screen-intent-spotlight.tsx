import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { useRouter } from 'expo-router';
import Flame from 'lucide-react-native/icons/flame';
import Leaf from 'lucide-react-native/icons/leaf';
import ScanSearch from 'lucide-react-native/icons/scan-search';
import LucideX from 'lucide-react-native/icons/x';
import { use } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { useReduceMotion } from '../../../../@generic/hooks/use-reduce-motion.hook';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { StoreIntentEnum } from '../../../enum/store-intent.enum';
import { HomeScreenIntentChip } from '../home-screen-intent-chip/home-screen-intent-chip';
import { HomeScreenIntentRatingLink } from '../home-screen-intent-rating-link/home-screen-intent-rating-link';

import { HomeScreenIntentSpotlightSelectors } from './home-screen-intent-spotlight.selectors';
import { HomeScreenIntentSpotlightStyles as styles } from './home-screen-intent-spotlight.styles';

const IntentContent = {
    [StoreIntentEnum.EXPERT]: {
        title: msg`Ready for a real challenge`,
        body: msg`Nightmare is set. See every puzzle's SE rating; Hell and Infinity go further.`,
        icon: Flame
    },
    [StoreIntentEnum.QUIET]: {
        title: msg`Take it slow`,
        body: msg`Relaxed mistakes are on, with no limit. Works offline.`,
        icon: Leaf
    },
    [StoreIntentEnum.TECHNIQUES]: {
        title: msg`Practice harder logic`,
        body: msg`Hard is set. Replay finished puzzles move by move from History and see the techniques used.`,
        icon: ScanSearch
    }
};

const EnterDurationMs = 180;
const ExitDurationMs = 140;

interface Props {
    readonly intent: StoreIntentEnum;
    readonly difficultyLabel: string;
    readonly mistakesTitle: string;
}

export const HomeScreenIntentSpotlight = ({ intent, difficultyLabel, mistakesTitle }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const { setParams } = useRouter();
    const isMotionReduced = useReduceMotion();
    const { title, body, icon: Icon } = IntentContent[intent];
    const animationProps = isMotionReduced ? {} : { entering: FadeIn.duration(EnterDurationMs), exiting: FadeOut.duration(ExitDurationMs) };
    const ratingLink = intent === StoreIntentEnum.TECHNIQUES ? <HomeScreenIntentRatingLink /> : null;
    const handleDismiss = () => {
        setParams({ intent: void 0 });
    };

    return (
        <Animated.View style={resolveUnistyleForAnimated(styles.card)} testID={HomeScreenIntentSpotlightSelectors.ROOT} {...animationProps}>
            <View style={styles.header}>
                <View accessible={false} style={styles.glyph}>
                    <Icon color={theme.colors.text.primary} size={18} />
                </View>
                <BlackText accessibilityRole="header" maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant} style={styles.title}>
                    {t(title)}
                </BlackText>
                <Pressable
                    accessibilityLabel={t`Dismiss setup spotlight`}
                    accessibilityRole="button"
                    hitSlop={4}
                    onPress={handleDismiss}
                    style={styles.dismiss}
                    testID={HomeScreenIntentSpotlightSelectors.DISMISS}
                >
                    <LucideX color={theme.colors.text.hint} size={18} />
                </Pressable>
            </View>
            <BlackText maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant} style={styles.body}>
                {t(body)}
            </BlackText>
            <View style={styles.chips} testID={HomeScreenIntentSpotlightSelectors.SETUP}>
                <HomeScreenIntentChip label={difficultyLabel} />
                <HomeScreenIntentChip label={mistakesTitle} />
            </View>
            {ratingLink}
        </Animated.View>
    );
};
