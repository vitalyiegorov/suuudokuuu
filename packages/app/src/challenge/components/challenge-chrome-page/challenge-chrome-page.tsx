import { ScreenChromeScrollView } from '@suuudokuuu/screen-chrome';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChromePage } from '../../../@generic/components/chrome-page/chrome-page';
import {
    ChallengeChromeFooterExtraReserve,
    ChallengeChromeFooterFadeIntensity,
    ChallengeChromeFooterMinReserve,
    ChallengeChromeTopContentInset,
    ChallengeChromeTopFadeHeight
} from '../../constants/challenge-chrome.constant';

import { ChallengeChromePageStyles as styles } from './challenge-chrome-page.styles';

import type { ReactNode } from 'react';
import type { LayoutChangeEvent } from 'react-native';

interface Props {
    readonly children: ReactNode;
    readonly footer: ReactNode;
    readonly testID?: string;
}

export const ChallengeChromePage = ({ children, footer, testID }: Props) => {
    const insets = useSafeAreaInsets();
    const [footerHeight, setFooterHeight] = useState(0);

    const handleFooterLayout = (event: LayoutChangeEvent) => {
        setFooterHeight(event.nativeEvent.layout.height);
    };

    const footerReserve = Math.max(ChallengeChromeFooterMinReserve, footerHeight + insets.bottom + ChallengeChromeFooterExtraReserve);
    const footerNode = <View onLayout={handleFooterLayout}>{footer}</View>;
    const footerEdgeFadeProps = { height: footerReserve, intensity: ChallengeChromeFooterFadeIntensity };
    const topEdgeFadeProps = { height: ChallengeChromeTopFadeHeight };

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
                contentInsetTop={ChallengeChromeTopContentInset}
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
            >
                {children}
            </ScreenChromeScrollView>
        </ChromePage>
    );
};
