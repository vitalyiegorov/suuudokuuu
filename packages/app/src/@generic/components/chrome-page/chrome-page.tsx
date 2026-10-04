import { View } from 'react-native';

import { EdgeFade, ScreenChromeFrame } from '@rnw-community/react-native-screen-chrome';

import { useBackdropRecomposite } from '../../hooks/use-backdrop-recomposite/use-backdrop-recomposite.hook';
import { ScreenChromeThemeProvider } from '../screen-chrome-theme-provider/screen-chrome-theme-provider';

import { ChromePageStyles as styles } from './chrome-page.styles';

import type { EdgeFadePropsInterface } from '@rnw-community/react-native-screen-chrome';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly children: ReactNode;
    readonly contentStyle?: StyleProp<ViewStyle>;
    readonly footer?: ReactNode;
    readonly testID?: string;
    readonly topEdgeFadeProps?: Omit<EdgeFadePropsInterface, 'position'>;
}

export const ChromePage = (props: Props) => {
    const { children, contentStyle, footer, testID, topEdgeFadeProps } = props;

    const backdropRecompositeRef = useBackdropRecomposite();

    const contentStyles = [styles.content, contentStyle];

    return (
        <View ref={backdropRecompositeRef} style={styles.frame} testID={testID}>
            <ScreenChromeThemeProvider>
                <ScreenChromeFrame>
                    <View style={contentStyles}>{children}</View>
                    <EdgeFade position="top" {...topEdgeFadeProps} />
                    {footer}
                </ScreenChromeFrame>
            </ScreenChromeThemeProvider>
        </View>
    );
};
