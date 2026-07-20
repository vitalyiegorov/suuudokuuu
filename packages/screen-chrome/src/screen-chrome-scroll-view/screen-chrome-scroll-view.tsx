import { ComponentProps, ReactNode, Ref, useMemo } from 'react';
import { ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useScreenChromeScrollHandler } from '../hook/use-screen-chrome-scroll-handler.hook';
import { useScreenChrome } from '../hook/use-screen-chrome.hook';
import { mergeRefs } from '../utils/merge-refs.util';
import { mergeScrollContentInset } from '../utils/merge-scroll-content-inset.util';

interface Props extends ComponentProps<typeof ScrollView> {
    readonly contentInsetTop?: number;
    readonly contentInsetBottom?: number;
    readonly ref?: Ref<Animated.ScrollView>;
}

export const ScreenChromeScrollView = ({
    contentInsetTop = 0,
    contentInsetBottom = 0,
    contentContainerStyle,
    ref,
    ...scrollViewProps
}: Props): ReactNode => {
    const { config, scrollRef } = useScreenChrome();
    const insets = useSafeAreaInsets();
    const onScroll = useScreenChromeScrollHandler();
    const mergedRef = useMemo(() => mergeRefs(scrollRef, ref), [scrollRef, ref]);
    const mergedContentContainerStyle = useMemo(
        () => mergeScrollContentInset(insets, contentInsetTop, contentInsetBottom, contentContainerStyle),
        [insets, contentInsetTop, contentInsetBottom, contentContainerStyle]
    );

    return (
        <Animated.ScrollView
            {...scrollViewProps}
            ref={mergedRef}
            contentContainerStyle={mergedContentContainerStyle}
            onScroll={onScroll}
            scrollEventThrottle={config.scrollEventThrottle}
        />
    );
};
