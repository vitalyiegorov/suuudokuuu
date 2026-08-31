import { CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { use } from 'react';

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
import { Header } from '../header/header';
import { HeaderBackButton } from '../header-back-button/header-back-button';
import { TabBarInsetContext } from '../main-tab-layout/context/tab-bar-inset.context';
import { ScreenChromeContent } from '../screen-chrome-content/screen-chrome-content';
import { ScreenChromeThemeProvider } from '../screen-chrome-theme-provider/screen-chrome-theme-provider';
import { StickyFooterBand } from '../sticky-footer-band/sticky-footer-band';

import { CollapsibleChromePageStyles as styles } from './collapsible-chrome-page.styles';

import type { ComponentProps, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

interface Props extends Omit<ComponentProps<typeof ScreenChromeScrollView>, 'children' | 'contentContainerStyle'> {
    readonly children: ReactNode;
    readonly contentContainerStyle?: StyleProp<ViewStyle>;
    readonly contentStyle?: StyleProp<ViewStyle>;
    readonly footer?: ReactNode;
    readonly footerStyle?: StyleProp<ViewStyle>;
    readonly leading?: ReactNode;
    readonly title: string;
    readonly trailing?: ReactNode;
}

const CollapsibleChromePageFooterContentInset = 96;

export const CollapsibleChromePage = (props: Props) => {
    const {
        alwaysBounceVertical = true,
        bounces = true,
        children,
        contentContainerStyle,
        contentStyle,
        footer,
        footerStyle,
        leading,
        showsVerticalScrollIndicator = false,
        title,
        trailing,
        ...scrollViewProps
    } = props;

    const tabBarInset = use(TabBarInsetContext);
    const footerInset = isDefined(footer) ? CollapsibleChromePageFooterContentInset : 0;
    const contentInsetBottom = footerInset + tabBarInset;
    const leadingContent = isDefined(leading) ? leading : <HeaderBackButton />;

    return (
        <ScreenChromeThemeProvider>
            <ScreenChromeFrame>
                <ScreenChromeContent style={contentStyle}>
                    <ScreenChromeScrollView
                        {...scrollViewProps}
                        alwaysBounceVertical={alwaysBounceVertical}
                        bounces={bounces}
                        contentContainerStyle={contentContainerStyle}
                        contentInsetBottom={contentInsetBottom}
                        contentInsetMode="additive"
                        contentInsetTop={ScreenChromeContentInsetTop}
                        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
                    >
                        {children}
                    </ScreenChromeScrollView>
                </ScreenChromeContent>

                <CollapsibleHeaderBackdrop />

                <CollapsibleHeader
                    collapsedContentContainerStyle={styles.titleLayer}
                    expandedContentContainerStyle={styles.expandedTitleLayer}
                    persistentContentContainerStyle={styles.persistentLayer}
                >
                    <CollapsibleHeaderSlot>{leadingContent}</CollapsibleHeaderSlot>
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
                    <CollapsibleHeaderSlot>{trailing}</CollapsibleHeaderSlot>
                </CollapsibleHeader>

                {isDefined(footer) ? <StickyFooterBand contentStyle={footerStyle}>{footer}</StickyFooterBand> : null}
            </ScreenChromeFrame>
        </ScreenChromeThemeProvider>
    );
};
