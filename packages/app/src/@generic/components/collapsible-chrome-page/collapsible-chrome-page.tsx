import { CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { use } from 'react';
import { View } from 'react-native';

import {
    CollapsibleHeader,
    CollapsibleHeaderBackdrop,
    CollapsibleHeaderSlot,
    CollapsibleHeaderTitleSlot,
    ScreenChromeFrame,
    ScreenChromeScrollView
} from '@rnw-community/react-native-screen-chrome';
import { isDefined } from '@rnw-community/shared';

import { ScreenChromeContentInsetTop } from '../../constants/screen-chrome-content-inset.constant';
import { useBackdropRecomposite } from '../../hooks/use-backdrop-recomposite/use-backdrop-recomposite.hook';
import { Header } from '../header/header';
import { HeaderBackButton } from '../header-back-button/header-back-button';
import { TabBarInsetContext } from '../main-tab-layout/context/tab-bar-inset.context';
import { ScreenChromeThemeProvider } from '../screen-chrome-theme-provider/screen-chrome-theme-provider';
import { StickyFooterBand } from '../sticky-footer-band/sticky-footer-band';

import { CollapsibleChromePageStyles as styles } from './collapsible-chrome-page.styles';

import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly children: ReactNode;
    readonly contentContainerStyle?: StyleProp<ViewStyle>;
    readonly contentStyle?: StyleProp<ViewStyle>;
    readonly footer?: ReactNode;
    readonly footerStyle?: StyleProp<ViewStyle>;
    readonly style?: StyleProp<ViewStyle>;
    readonly testID?: string;
    readonly title: string;
}

const CollapsibleChromePageFooterContentInset = 96;

export const CollapsibleChromePage = (props: Props) => {
    const { children, contentContainerStyle, contentStyle, footer, footerStyle, style, testID, title } = props;

    const tabBarInset = use(TabBarInsetContext);
    const backdropRecompositeRef = useBackdropRecomposite();

    const footerInset = isDefined(footer) ? CollapsibleChromePageFooterContentInset : 0;
    const contentInsetBottom = footerInset + tabBarInset;
    const contentStyles = [styles.content, contentStyle];

    return (
        <View ref={backdropRecompositeRef} style={styles.frame}>
            <ScreenChromeThemeProvider>
                <ScreenChromeFrame>
                    <View style={contentStyles}>
                        <ScreenChromeScrollView
                            contentContainerStyle={contentContainerStyle}
                            contentInsetBottom={contentInsetBottom}
                            contentInsetMode="additive"
                            contentInsetTop={ScreenChromeContentInsetTop}
                            showsVerticalScrollIndicator={false}
                            style={style}
                            testID={testID}
                        >
                            {children}
                        </ScreenChromeScrollView>
                    </View>

                    <CollapsibleHeaderBackdrop />

                    <CollapsibleHeader
                        collapsedContentContainerStyle={styles.titleLayer}
                        expandedContentContainerStyle={styles.expandedTitleLayer}
                        persistentContentContainerStyle={styles.persistentLayer}
                    >
                        <CollapsibleHeaderSlot>
                            <HeaderBackButton />
                        </CollapsibleHeaderSlot>
                        <CollapsibleHeaderTitleSlot>
                            <Header
                                maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant}
                                numberOfLines={1}
                                style={styles.largeTitle}
                                text={title}
                            />
                            <Header
                                maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant}
                                numberOfLines={1}
                                style={styles.smallTitle}
                                text={title}
                            />
                        </CollapsibleHeaderTitleSlot>
                        <CollapsibleHeaderSlot />
                    </CollapsibleHeader>

                    {isDefined(footer) ? <StickyFooterBand contentStyle={footerStyle}>{footer}</StickyFooterBand> : null}
                </ScreenChromeFrame>
            </ScreenChromeThemeProvider>
        </View>
    );
};
