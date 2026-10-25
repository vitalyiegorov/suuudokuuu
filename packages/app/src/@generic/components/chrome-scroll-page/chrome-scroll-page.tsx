import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenChromeScrollView } from '@rnw-community/react-native-screen-chrome';

import { AppScreenChromeLayoutConfig } from '../../constants/screen-chrome-config.constant';
import { ChromePage } from '../chrome-page/chrome-page';
import { StickyFooterBand } from '../sticky-footer-band/sticky-footer-band';

import { ChromeScrollPageStyles as styles } from './chrome-scroll-page.styles';

import type { ReactNode } from 'react';
import type { LayoutChangeEvent } from 'react-native';

interface Props {
    readonly children: ReactNode;
    readonly footer: ReactNode;
    readonly testID?: string;
}

const ChromeScrollPageTopFadeHeight = 144;
const ChromeScrollPageContentTuck = 36;
const ChromeScrollPageContentInsetTop = AppScreenChromeLayoutConfig.headerTopInset + 40;
const ChromeScrollPageFooterFadeIntensity = 80;
const ChromeScrollPageFooterMinReserve = 132;
const ChromeScrollPageFooterExtraReserve = 88;

export const ChromeScrollPage = ({ children, footer, testID }: Props) => {
    const insets = useSafeAreaInsets();
    const [footerHeight, setFooterHeight] = useState(0);

    const handleFooterLayout = (event: LayoutChangeEvent) => {
        setFooterHeight(event.nativeEvent.layout.height);
    };

    const bandClearanceInset = ChromeScrollPageTopFadeHeight - ChromeScrollPageContentTuck - insets.top;
    const contentInsetTop = Math.max(ChromeScrollPageContentInsetTop, bandClearanceInset);
    const footerReserve = Math.max(ChromeScrollPageFooterMinReserve, footerHeight + insets.bottom + ChromeScrollPageFooterExtraReserve);
    const footerEdgeFadeProps = {
        chromeHeight: footerHeight,
        height: footerReserve - insets.bottom,
        intensity: ChromeScrollPageFooterFadeIntensity
    };
    const topEdgeFadeProps = { height: ChromeScrollPageTopFadeHeight - insets.top };
    const footerBand = (
        <StickyFooterBand contentStyle={styles.footer} edgeFadeProps={footerEdgeFadeProps}>
            <View onLayout={handleFooterLayout}>{footer}</View>
        </StickyFooterBand>
    );

    return (
        <ChromePage contentStyle={styles.chromeContent} footer={footerBand} testID={testID} topEdgeFadeProps={topEdgeFadeProps}>
            <ScreenChromeScrollView
                contentContainerStyle={styles.scrollContent}
                contentInsetBottom={footerReserve}
                contentInsetMode="additive"
                contentInsetTop={contentInsetTop}
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
            >
                {children}
            </ScreenChromeScrollView>
        </ChromePage>
    );
};
