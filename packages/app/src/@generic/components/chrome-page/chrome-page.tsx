import { EdgeFade, ScreenChromeContent, ScreenChromeFrame } from '@suuudokuuu/screen-chrome';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { isDefined } from '@rnw-community/shared';

import { ScreenChromeThemeProvider } from '../screen-chrome-theme-provider/screen-chrome-theme-provider';
import { StickyFooterBand } from '../sticky-footer-band/sticky-footer-band';

import { ChromePageStyles as styles } from './chrome-page.styles';

import type { EdgeFadePropsInterface } from '@suuudokuuu/screen-chrome';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly children: ReactNode;
    readonly contentStyle?: StyleProp<ViewStyle>;
    readonly footer?: ReactNode;
    readonly footerEdgeFadeProps?: Omit<EdgeFadePropsInterface, 'position'>;
    readonly footerStyle?: StyleProp<ViewStyle>;
    readonly header?: ReactNode;
    readonly headerStyle?: StyleProp<ViewStyle>;
    readonly style?: StyleProp<ViewStyle>;
    readonly testID?: string;
    readonly topEdgeFadeProps?: Omit<EdgeFadePropsInterface, 'position'>;
}

export const ChromePage = (props: Props) => {
    const { children, contentStyle, footer, footerEdgeFadeProps, footerStyle, header, headerStyle, style, testID, topEdgeFadeProps } =
        props;
    const { top } = useSafeAreaInsets();

    const containerStyles = [styles.container, style];
    const headerContainerStyles = [styles.header, { paddingTop: top }];

    return (
        <View style={containerStyles} testID={testID}>
            <ScreenChromeThemeProvider>
                <ScreenChromeFrame>
                    <ScreenChromeContent style={contentStyle}>{children}</ScreenChromeContent>
                    <EdgeFade position="top" {...topEdgeFadeProps} />

                    {isDefined(header) ? (
                        <View pointerEvents="box-none" style={headerContainerStyles}>
                            <View style={headerStyle}>{header}</View>
                        </View>
                    ) : null}

                    {isDefined(footer) ? (
                        <StickyFooterBand contentStyle={footerStyle} edgeFadeProps={footerEdgeFadeProps}>
                            {footer}
                        </StickyFooterBand>
                    ) : null}
                </ScreenChromeFrame>
            </ScreenChromeThemeProvider>
        </View>
    );
};
