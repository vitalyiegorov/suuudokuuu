import { CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { use } from 'react';
import { Pressable, Text } from 'react-native';

import { cs } from '@rnw-community/shared';

import { ThemeContext } from '../../../theme/context/theme.context';
import { applyColorAlpha } from '../../utils/apply-color-alpha.util';
import { FloatingTabBarFocusedSegmentAlpha, FloatingTabBarLabelMinimumScale } from '../floating-tab-bar/constant/floating-tab-bar.constant';

import { FloatingTabBarItemStyles as styles } from './floating-tab-bar-item.styles';

import type { ReactNode } from 'react';

interface Props {
    readonly accessibilityLabel: string;
    readonly children: ReactNode;
    readonly isFocused: boolean;
    readonly label: string;
    readonly onPress: () => void;
    readonly testID?: string;
}

export const FloatingTabBarItem = (props: Props) => {
    const { accessibilityLabel, children, isFocused, label, onPress, testID } = props;

    const { theme } = use(ThemeContext);

    const focusedSegmentStyle = { backgroundColor: applyColorAlpha(theme.colors.text.primary, FloatingTabBarFocusedSegmentAlpha) };
    const segmentStyles = [styles.segment, cs(isFocused, focusedSegmentStyle)];
    const labelColor = isFocused ? theme.colors.text.primary : theme.colors.text.hint;
    const labelStyles = [styles.label, { color: labelColor }];
    const selectedState = { selected: isFocused };

    return (
        <Pressable
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="tab"
            accessibilityState={selectedState}
            onPress={onPress}
            style={segmentStyles}
            testID={testID}
        >
            {children}
            <Text
                adjustsFontSizeToFit
                maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant}
                minimumFontScale={FloatingTabBarLabelMinimumScale}
                numberOfLines={1}
                style={labelStyles}
            >
                {label}
            </Text>
        </Pressable>
    );
};
