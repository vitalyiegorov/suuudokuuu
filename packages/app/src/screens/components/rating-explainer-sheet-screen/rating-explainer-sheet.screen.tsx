import { useLingui } from '@lingui/react/macro';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import LucideX from 'lucide-react-native/icons/x';
import { use, useEffect } from 'react';
import { ScrollView, View } from 'react-native';

import { isNotEmptyString } from '@rnw-community/shared';

import { AppIconButton } from '../../../@generic/components/app-icon-button/app-icon-button';
import { RatingExplainer } from '../../../@generic/components/rating-explainer/rating-explainer';
import { SheetFrame } from '../../../@generic/components/sheet-frame/sheet-frame';
import { RatingExplainerCeilingParamValue } from '../../../@generic/utils/get-rating-explainer-href.util';
import { useDifficultyStats } from '../../../history/query/use-difficulty-stats.query';
import { historyGetBestRating } from '../../../history/utils/history-get-best-rating.util';
import { ThemeContext } from '../../../theme/context/theme.context';

import { RatingExplainerSheetScreenSelectors } from './rating-explainer-sheet-screen.selectors';
import { RatingExplainerSheetScreenStyles as styles } from './rating-explainer-sheet.screen.styles';

const RatingExplainerDetent = 0.75;
const RatingExplainerDetents = [RatingExplainerDetent];

export const RatingExplainerSheetScreen = () => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const params = useLocalSearchParams<{ rating?: string | string[]; isCeiling?: string | string[] }>();
    const ratingParam = Array.isArray(params.rating) ? '' : (params.rating ?? '');
    const isCeilingParam = Array.isArray(params.isCeiling) ? '' : (params.isCeiling ?? '');
    const parsedRating = Number(ratingParam);
    const hasValidRating = isNotEmptyString(ratingParam) && !Number.isNaN(parsedRating);
    const bestRating = historyGetBestRating(useDifficultyStats());
    const canGoBack = router.canGoBack();
    const shouldGoBack = !hasValidRating && canGoBack;

    useEffect(() => {
        if (shouldGoBack) {
            router.back();
        }
    }, [shouldGoBack]);

    if (!hasValidRating) {
        return canGoBack ? null : <Redirect href="/" />;
    }

    const handleClose = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/');
        }
    };

    return (
        <SheetFrame detents={RatingExplainerDetents}>
            <ScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
                <View style={styles.sheetHeader}>
                    <AppIconButton
                        accessibilityLabel={t`Close`}
                        hitSlop={10}
                        onPress={handleClose}
                        testID={RatingExplainerSheetScreenSelectors.CloseButton}
                        variant="ghost"
                    >
                        <LucideX color={theme.colors.text.primary} />
                    </AppIconButton>
                </View>

                <RatingExplainer
                    bestRating={bestRating}
                    isCeiling={isCeilingParam === RatingExplainerCeilingParamValue}
                    rating={parsedRating}
                />
            </ScrollView>
        </SheetFrame>
    );
};
