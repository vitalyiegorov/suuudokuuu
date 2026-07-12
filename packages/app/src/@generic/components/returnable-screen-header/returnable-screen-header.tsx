import { View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { resolveUnistyleForAnimated } from '../../utils/resolve-unistyle-for-animated.util';
import { Header } from '../header/header';
import { HeaderBackButton } from '../header-back-button/header-back-button';

import {
    ReturnableScreenHeaderHeight,
    ReturnableScreenHeaderLargeTitleEnd,
    ReturnableScreenHeaderScrollEnd,
    ReturnableScreenHeaderScrollStart,
    ReturnableScreenHeaderSmallTitleStart
} from './constant/returnable-screen-header.constant';
import { ReturnableScreenHeaderStyles as styles } from './returnable-screen-header.styles';

import type { SharedValue } from 'react-native-reanimated';

interface Props {
    readonly scrollY: SharedValue<number>;
    readonly title: string;
}

export const ReturnableScreenHeader = ({ scrollY, title }: Props) => {
    const insets = useSafeAreaInsets();

    const largeTitleAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            scrollY.value,
            [ReturnableScreenHeaderScrollStart, ReturnableScreenHeaderLargeTitleEnd],
            [1, 0],
            Extrapolation.CLAMP
        )
    }));
    const smallTitleAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            scrollY.value,
            [ReturnableScreenHeaderSmallTitleStart, ReturnableScreenHeaderScrollEnd],
            [0, 1],
            Extrapolation.CLAMP
        )
    }));
    const containerStyles = [styles.container, { height: insets.top + ReturnableScreenHeaderHeight, paddingTop: insets.top }];
    const titleLayerStyle = resolveUnistyleForAnimated(styles.titleLayer);
    const smallTitleStyles = [titleLayerStyle, resolveUnistyleForAnimated(styles.smallTitleLayer), smallTitleAnimatedStyle];
    const largeTitleStyles = [titleLayerStyle, resolveUnistyleForAnimated(styles.largeTitleLayer), largeTitleAnimatedStyle];

    return (
        <View style={containerStyles}>
            <View style={styles.row}>
                <HeaderBackButton />
                <View style={styles.titleSlot}>
                    <Animated.View pointerEvents="none" style={largeTitleStyles}>
                        <Header numberOfLines={1} style={styles.largeTitle} text={title} />
                    </Animated.View>
                    <Animated.View pointerEvents="none" style={smallTitleStyles}>
                        <Header numberOfLines={1} style={styles.smallTitle} text={title} />
                    </Animated.View>
                </View>
                <View style={styles.trailingSpace} />
            </View>
        </View>
    );
};
