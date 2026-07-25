import { ScreenChromeScrollView } from '@suuudokuuu/screen-chrome';
import { ReactNode, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChromePage } from '../chrome-page/chrome-page';

import {
    GameResultFooterExtraReserve,
    GameResultFooterFadeIntensity,
    GameResultFooterMinReserve
} from './constant/game-result-page.constant';
import { GameResultPageStyles as styles } from './game-result-page.styles';

import type { LayoutChangeEvent } from 'react-native';

interface Props {
    readonly children: ReactNode;
    readonly footer: ReactNode;
    readonly testID: string;
}

export const GameResultPage = ({ children, footer, testID }: Props): ReactNode => {
    const insets = useSafeAreaInsets();
    const [footerHeight, setFooterHeight] = useState(0);

    const handleFooterLayout = (event: LayoutChangeEvent) => {
        setFooterHeight(event.nativeEvent.layout.height);
    };

    const footerReserve = Math.max(GameResultFooterMinReserve, footerHeight + insets.bottom + GameResultFooterExtraReserve);
    const footerNode = <View onLayout={handleFooterLayout}>{footer}</View>;
    const footerEdgeFadeProps = { height: footerReserve, intensity: GameResultFooterFadeIntensity };

    return (
        <ChromePage contentStyle={styles.chromeContent} footer={footerNode} footerEdgeFadeProps={footerEdgeFadeProps} testID={testID}>
            <ScreenChromeScrollView
                contentContainerStyle={styles.scrollContent}
                contentInsetBottom={footerReserve}
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
            >
                <View style={styles.content}>{children}</View>
            </ScreenChromeScrollView>
        </ChromePage>
    );
};
