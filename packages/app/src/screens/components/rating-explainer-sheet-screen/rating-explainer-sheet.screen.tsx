import BottomSheet, { BottomSheetScrollView } from '@expo/ui/community/bottom-sheet';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

import { isNotEmptyString } from '@rnw-community/shared';

import { RatingExplainer } from '../../../@generic/components/rating-explainer/rating-explainer';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { gameBestRatingSelector } from '../../../game/store/game.selectors';

import { RatingExplainerSheetScreenStyles as styles } from './rating-explainer-sheet.screen.styles';

const RatingExplainerSnapPoints = ['75%'];
const CeilingParamValue = '1';

export const RatingExplainerSheetScreen = () => {
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

    return (
        <>
            <Stack.Screen />
            <BottomSheet
                backgroundStyle={styles.sheetBackground}
                enableDynamicSizing={false}
                enablePanDownToClose
                index={0}
                onClose={router.back}
                snapPoints={RatingExplainerSnapPoints}
            >
                <BottomSheetScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
                    <RatingExplainer bestRating={bestRating} isCeiling={isCeilingParam === CeilingParamValue} rating={parsedRating} />
                </BottomSheetScrollView>
            </BottomSheet>
        </>
    );
};
