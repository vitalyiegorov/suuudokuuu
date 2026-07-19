import { ScreenChromeScrollView } from '@suuudokuuu/screen-chrome';
import { ReactNode } from 'react';
import { View } from 'react-native';

import { ChromePage } from '../chrome-page/chrome-page';

import { GameResultFooterFadeIntensity, GameResultFooterHeight } from './constant/game-result-page.constant';
import { GameResultPageStyles as styles } from './game-result-page.styles';

interface Props {
    readonly children: ReactNode;
    readonly footer: ReactNode;
    readonly testID: string;
}

export const GameResultPage = ({ children, footer, testID }: Props): ReactNode => {
    const footerEdgeFadeProps = { height: GameResultFooterHeight, intensity: GameResultFooterFadeIntensity };

    return (
        <ChromePage contentStyle={styles.chromeContent} footer={footer} footerEdgeFadeProps={footerEdgeFadeProps} testID={testID}>
            <ScreenChromeScrollView
                contentContainerStyle={styles.scrollContent}
                contentInsetBottom={GameResultFooterHeight}
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
            >
                <View style={styles.content}>{children}</View>
            </ScreenChromeScrollView>
        </ChromePage>
    );
};
