import { ReactNode } from 'react';
import Animated from 'react-native-reanimated';

import { useScreenChrome } from '../hook/use-screen-chrome.hook';
import { useScrollFadeStyle } from '../hook/use-scroll-fade-style.hook';

import { collapsibleHeaderSmallTitleStyles } from './collapsible-header-small-title.styles';

interface Props {
    readonly children: ReactNode;
}

const OUTPUT_RANGE: readonly [number, number] = [0, 1];

export const CollapsibleHeaderSmallTitle = ({ children }: Props): ReactNode => {
    const { config } = useScreenChrome();
    const inputRange: readonly [number, number] = [config.smallTitleStart, config.collapseEnd];
    const fadeStyle = useScrollFadeStyle(inputRange, OUTPUT_RANGE);
    const style = [collapsibleHeaderSmallTitleStyles.layer, fadeStyle];

    return (
        <Animated.View pointerEvents="none" style={style}>
            {children}
        </Animated.View>
    );
};
