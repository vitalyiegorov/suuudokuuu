import { Children } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';

import { AppMetricStripStyles as styles } from './app-metric-strip.styles';
import { AppMetricStripContext } from './context/app-metric-strip.context';
import { appMetricStripGetColors } from './utils/app-metric-strip-get-colors.util';
import { appMetricStripGetSeparatorKey } from './utils/app-metric-strip-get-separator-key.util';

import type { AppMetricStripVariant } from './utils/app-metric-strip-get-colors.util';
import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
    readonly separatorStyle?: StyleProp<ViewStyle>;
    readonly style?: StyleProp<ViewStyle>;
    readonly testID?: string;
    readonly variant: AppMetricStripVariant;
}

export const AppMetricStrip = ({ children, separatorStyle, style, testID, variant }: Props) => {
    const { theme } = useUnistyles();
    const { backgroundColor, borderColor, separatorColor, textColor } = appMetricStripGetColors(theme, variant);
    const stripStyles = [styles.strip, style, { backgroundColor, borderColor }];
    const separatorStyles = [styles.separator, separatorStyle, { backgroundColor: separatorColor }];
    const items = Children.toArray(children);
    const lastItemIndex = items.length - 1;
    const itemsWithSeparators = items.flatMap((item, index) => {
        if (index === lastItemIndex) {
            return [item];
        }

        return [item, <View key={appMetricStripGetSeparatorKey(item, index)} style={separatorStyles} />];
    });
    const contextValue = { textColor };

    return (
        <AppMetricStripContext value={contextValue}>
            <View style={stripStyles} testID={testID}>
                {itemsWithSeparators}
            </View>
        </AppMetricStripContext>
    );
};
