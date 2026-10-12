import { Trans } from '@lingui/react/macro';
import { CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { Link } from 'expo-router';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import { use } from 'react';
import { Pressable } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { HomeScreenIntentSpotlightSelectors } from '../home-screen-intent-spotlight/home-screen-intent-spotlight.selectors';
import { HomeScreenIntentSpotlightStyles as styles } from '../home-screen-intent-spotlight/home-screen-intent-spotlight.styles';

export const HomeScreenIntentRatingLink = () => {
    const { theme } = use(ThemeContext);

    return (
        <Link asChild href="/rating-explainer/0">
            <Pressable accessibilityRole="link" hitSlop={6} style={styles.link} testID={HomeScreenIntentSpotlightSelectors.RATING_LINK}>
                <BlackText maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant} style={styles.linkLabel}>
                    <Trans>How difficulty is rated</Trans>
                </BlackText>
                <ChevronRight color={theme.colors.text.primary} size={14} />
            </Pressable>
        </Link>
    );
};
