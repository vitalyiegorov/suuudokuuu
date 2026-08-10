import { useLingui } from '@lingui/react/macro';
import { AppMetricStripItem } from '@suuudokuuu/ui';
import { router } from 'expo-router';
import { View } from 'react-native';

import { getRatingExplainerHref } from '../../utils/get-rating-explainer-href.util';
import { RatingBadge } from '../rating-badge/rating-badge';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

interface Props {
    readonly isCeiling: boolean;
    readonly itemStyle?: StyleProp<ViewStyle>;
    readonly labelStyle?: StyleProp<TextStyle>;
    readonly rating: number;
    readonly testID?: string;
}

export const RatingMetricItem = ({ isCeiling, itemStyle, labelStyle, rating, testID }: Props) => {
    const { t } = useLingui();

    const handlePressRating = () => {
        router.push(getRatingExplainerHref(rating, isCeiling));
    };

    return (
        <AppMetricStripItem label={t`Rating`} labelStyle={labelStyle} style={itemStyle}>
            <View testID={testID}>
                <RatingBadge isCeiling={isCeiling} onPress={handlePressRating} rating={rating} />
            </View>
        </AppMetricStripItem>
    );
};
