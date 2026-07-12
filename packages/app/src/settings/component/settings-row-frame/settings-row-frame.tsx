import { use } from 'react';
import { View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';

import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly children: ReactNode;
    readonly dividerStyle: StyleProp<ViewStyle>;
    readonly hasDivider: boolean;
    readonly itemStyle: StyleProp<ViewStyle>;
}

export const SettingsRowFrame = ({ children, dividerStyle, hasDivider, itemStyle }: Props) => {
    const { theme } = use(ThemeContext);

    const dividerStyles = [dividerStyle, { backgroundColor: theme.colors.candidate.border }];

    return (
        <View style={itemStyle}>
            {children}
            {hasDivider ? <View style={dividerStyles} /> : null}
        </View>
    );
};
