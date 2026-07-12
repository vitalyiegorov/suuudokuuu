import { type StyleProp, type ViewStyle } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import { ReturnableScreenHeader } from '../returnable-screen-header/returnable-screen-header';
import { ReturnableScreenHeaderBackdrop } from '../returnable-screen-header-backdrop/returnable-screen-header-backdrop';
import { ScreenChrome } from '../screen-chrome/screen-chrome';
import { ScreenChromeProgressiveOverlay } from '../screen-chrome-progressive-overlay/screen-chrome-progressive-overlay';

import {
    ReturnableScreenChromeBottomBlurIntensity,
    ReturnableScreenChromeBottomOverlayHeight
} from './constant/returnable-screen-chrome.constant';
import { ReturnableScreenChromeScrollContext } from './context/returnable-screen-chrome-scroll.context';
import { ReturnableScreenChromeStyles as styles } from './returnable-screen-chrome.styles';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
    readonly contentStyle?: StyleProp<ViewStyle>;
    readonly title: string;
}

export const ReturnableScreenChrome = ({ children, contentStyle, title }: Props) => {
    const scrollY = useSharedValue(0);
    const header = <ReturnableScreenHeader scrollY={scrollY} title={title} />;
    const topOverlay = <ReturnableScreenHeaderBackdrop scrollY={scrollY} />;
    const bottomOverlay = (
        <ScreenChromeProgressiveOverlay
            height={ReturnableScreenChromeBottomOverlayHeight}
            intensity={ReturnableScreenChromeBottomBlurIntensity}
            position="bottom"
        />
    );

    return (
        <ReturnableScreenChromeScrollContext value={scrollY}>
            <ScreenChrome
                bottomOverlay={bottomOverlay}
                contentStyle={contentStyle}
                header={header}
                headerStyle={styles.headerChrome}
                topOverlay={topOverlay}
            >
                {children}
            </ScreenChrome>
        </ReturnableScreenChromeScrollContext>
    );
};
