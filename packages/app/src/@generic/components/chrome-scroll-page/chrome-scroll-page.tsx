import { ScreenChromeScrollView } from '@suuudokuuu/screen-chrome';
import { useState } from 'react';
import { View } from 'react-native';
import { initialWindowMetrics, useSafeAreaInsets } from 'react-native-safe-area-context';

import {
    ChromeScrollPageContentInsetTop,
    ChromeScrollPageFooterExtraReserve,
    ChromeScrollPageFooterFadeIntensity,
    ChromeScrollPageFooterMinReserve,
    ChromeScrollPageTopFadeHeight
} from '../../constants/chrome-scroll-page.constant';
import { ChromePage } from '../chrome-page/chrome-page';

import { ChromeScrollPageStyles as styles } from './chrome-scroll-page.styles';

import type { ReactNode } from 'react';
import type { LayoutChangeEvent } from 'react-native';

interface Props {
    readonly children: ReactNode;
    readonly footer: ReactNode;
    readonly testID?: string;
}

export const ChromeScrollPage = ({ children, footer, testID }: Props) => {
    const insets = useSafeAreaInsets();
    const [footerHeight, setFooterHeight] = useState(0);

    const handleFooterLayout = (event: LayoutChangeEvent) => {
        setFooterHeight(event.nativeEvent.layout.height);
    };

    const launchTopInset = initialWindowMetrics?.insets.top ?? 0;
    const missingTopInset = Math.max(0, launchTopInset - insets.top);
    const contentInsetTop = ChromeScrollPageContentInsetTop + missingTopInset;
    const footerReserve = Math.max(ChromeScrollPageFooterMinReserve, footerHeight + insets.bottom + ChromeScrollPageFooterExtraReserve);
    const footerNode = <View onLayout={handleFooterLayout}>{footer}</View>;
    const footerEdgeFadeProps = { height: footerReserve, intensity: ChromeScrollPageFooterFadeIntensity };
    const topEdgeFadeProps = { height: ChromeScrollPageTopFadeHeight };

    return (
        <ChromePage
            contentStyle={styles.chromeContent}
            footer={footerNode}
            footerEdgeFadeProps={footerEdgeFadeProps}
            footerStyle={styles.footer}
            testID={testID}
            topEdgeFadeProps={topEdgeFadeProps}
        >
            <ScreenChromeScrollView
                contentContainerStyle={styles.scrollContent}
                contentInsetBottom={footerReserve}
                contentInsetTop={contentInsetTop}
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
            >
                {children}
            </ScreenChromeScrollView>
        </ChromePage>
    );
};
