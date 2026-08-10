import BottomSheet, { BottomSheetScrollView } from '@expo/ui/community/bottom-sheet';
import { useLingui } from '@lingui/react/macro';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { LucideX } from 'lucide-react-native';
import { use, useEffect, useRef } from 'react';
import { View } from 'react-native';

import { isNotEmptyString } from '@rnw-community/shared';

import { AppIconButton } from '../../../@generic/components/app-icon-button/app-icon-button';
import { RatingExplainer } from '../../../@generic/components/rating-explainer/rating-explainer';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { gameBestRatingSelector } from '../../../game/store/game.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';

import { RatingExplainerSheetScreenSelectors } from './rating-explainer-sheet-screen.selectors';
import { RatingExplainerSheetScreenStyles as styles } from './rating-explainer-sheet.screen.styles';

import type { BottomSheetMethods } from '@expo/ui/community/bottom-sheet';

const RatingExplainerSnapPoints = ['75%'];
const CeilingParamValue = '1';

export const RatingExplainerSheetScreen = () => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const sheetRef = useRef<BottomSheetMethods>(null);
    const params = useLocalSearchParams<{ rating?: string | string[]; isCeiling?: string | string[] }>();
    const ratingParam = Array.isArray(params.rating) ? '' : (params.rating ?? '');
    const isCeilingParam = Array.isArray(params.isCeiling) ? '' : (params.isCeiling ?? '');
    const parsedRating = Number(ratingParam);
    const hasValidRating = isNotEmptyString(ratingParam) && !Number.isNaN(parsedRating);
    const bestRating = useAppSelector(gameBestRatingSelector);

    useEffect(() => {
        if (!hasValidRating) {
            router.back();
        }
    }, [hasValidRating]);

    if (!hasValidRating) {
        return null;
    }

    const handleClose = () => sheetRef.current?.close();

    return (
        <>
            <Stack.Screen />
            <BottomSheet
                backgroundStyle={styles.sheetBackground}
                enableDynamicSizing={false}
                enablePanDownToClose
                index={0}
                onClose={router.back}
                ref={sheetRef}
                snapPoints={RatingExplainerSnapPoints}
            >
                <BottomSheetScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
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

                    <RatingExplainer bestRating={bestRating} isCeiling={isCeilingParam === CeilingParamValue} rating={parsedRating} />
                </BottomSheetScrollView>
            </BottomSheet>
        </>
    );
};
