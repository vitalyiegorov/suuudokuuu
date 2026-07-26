import { use } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { isNotEmptyString } from '@rnw-community/shared';

import { ThemeContext } from '../../../theme/context/theme.context';
import { FloatingTabBarItem } from '../floating-tab-bar-item/floating-tab-bar-item';
import { FloatingTabBarSurface } from '../floating-tab-bar-surface/floating-tab-bar-surface';

import { FloatingTabBarBottomMargin, FloatingTabBarIconSize } from './constant/floating-tab-bar.constant';
import { FloatingTabBarStyles as styles } from './floating-tab-bar.styles';

import type { BottomTabBarProps } from 'expo-router/tabs';

export const FloatingTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const { theme } = use(ThemeContext);
    const safeAreaInsets = useSafeAreaInsets();

    const anchorStyles = [styles.anchor, { bottom: safeAreaInsets.bottom + FloatingTabBarBottomMargin }];

    return (
        <View pointerEvents="box-none" style={anchorStyles}>
            <FloatingTabBarSurface>
                <View style={styles.row}>
                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                        const isFocused = state.index === index;
                        const iconColor = isFocused ? theme.colors.label.main : theme.colors.label.hint;
                        const label = isNotEmptyString(options.title) ? options.title : route.name;

                        const handlePress = () => {
                            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name, route.params);
                            }
                        };

                        return (
                            <FloatingTabBarItem
                                accessibilityLabel={label}
                                isFocused={isFocused}
                                key={route.key}
                                label={label}
                                onPress={handlePress}
                                testID={options.tabBarButtonTestID}
                            >
                                {options.tabBarIcon?.({ color: iconColor, focused: isFocused, size: FloatingTabBarIconSize })}
                            </FloatingTabBarItem>
                        );
                    })}
                </View>
            </FloatingTabBarSurface>
        </View>
    );
};
