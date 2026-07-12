import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
    ReturnableScreenChromeBottomContentInsetByPreset,
    ReturnableScreenChromeFullBottomContentPreset,
    ReturnableScreenChromeRegularContentPreset,
    ReturnableScreenChromeScrollEventThrottle,
    ReturnableScreenChromeTopContentInsetByPreset
} from '../returnable-screen-chrome/constant/returnable-screen-chrome.constant';
import { useReturnableScreenChromeScrollHandler } from '../returnable-screen-chrome/hooks/use-returnable-screen-chrome-scroll-handler.hook';
import { returnableScreenChromeGetContentContainerStyle } from '../returnable-screen-chrome/utils/returnable-screen-chrome-get-content-container-style.util';

import type {
    ReturnableScreenChromeBottomContentPreset,
    ReturnableScreenChromeContentPreset
} from '../returnable-screen-chrome/constant/returnable-screen-chrome.constant';
import type { ComponentProps } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

interface Props extends Omit<ComponentProps<typeof Animated.ScrollView>, 'contentContainerStyle'> {
    readonly bottomContentPreset?: ReturnableScreenChromeBottomContentPreset;
    readonly contentContainerStyle?: StyleProp<ViewStyle>;
    readonly topContentPreset?: ReturnableScreenChromeContentPreset;
}

export const ReturnableScreenScrollView = ({
    alwaysBounceVertical = true,
    bounces = true,
    bottomContentPreset = ReturnableScreenChromeFullBottomContentPreset,
    contentContainerStyle,
    scrollEventThrottle = ReturnableScreenChromeScrollEventThrottle,
    showsVerticalScrollIndicator = false,
    topContentPreset = ReturnableScreenChromeRegularContentPreset,
    ...props
}: Props) => {
    const insets = useSafeAreaInsets();
    const scrollHandler = useReturnableScreenChromeScrollHandler();
    const bottomContentInset = ReturnableScreenChromeBottomContentInsetByPreset[bottomContentPreset];
    const topContentInset = ReturnableScreenChromeTopContentInsetByPreset[topContentPreset];
    const contentContainerStyles = returnableScreenChromeGetContentContainerStyle({
        bottomContentInset,
        bottomInset: insets.bottom,
        contentContainerStyle,
        topContentInset,
        topInset: insets.top
    });

    return (
        <Animated.ScrollView
            {...props}
            alwaysBounceVertical={alwaysBounceVertical}
            bounces={bounces}
            contentContainerStyle={contentContainerStyles}
            onScroll={scrollHandler}
            scrollEventThrottle={scrollEventThrottle}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        />
    );
};
