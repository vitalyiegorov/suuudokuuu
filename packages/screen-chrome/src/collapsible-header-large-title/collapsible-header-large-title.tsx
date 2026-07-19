import { ReactNode } from 'react';
import Animated from 'react-native-reanimated';

import { useScreenChrome } from '../hook/use-screen-chrome.hook';
import { useScrollFadeStyle } from '../hook/use-scroll-fade-style.hook';

interface Props {
    readonly children: ReactNode;
}

const OUTPUT_RANGE: readonly [number, number] = [1, 0];

export const CollapsibleHeaderLargeTitle = ({ children }: Props): ReactNode => {
    const { config } = useScreenChrome();
    const inputRange: readonly [number, number] = [config.collapseStart, config.largeTitleEnd];
    const fadeStyle = useScrollFadeStyle(inputRange, OUTPUT_RANGE);

    return (
        <Animated.View pointerEvents="none" style={fadeStyle}>
            {children}
        </Animated.View>
    );
};
