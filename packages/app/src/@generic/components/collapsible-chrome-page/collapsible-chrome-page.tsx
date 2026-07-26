import {
    CollapsibleHeader,
    CollapsibleHeaderBackdrop,
    CollapsibleHeaderLargeTitle,
    CollapsibleHeaderLeading,
    CollapsibleHeaderSmallTitle,
    CollapsibleHeaderTitleSlot,
    CollapsibleHeaderTrailing,
    ScreenChromeContent,
    ScreenChromeFrame,
    ScreenChromeScrollView
} from '@suuudokuuu/screen-chrome';
import { use } from 'react';

import { isDefined } from '@rnw-community/shared';

import { ScreenChromeContentInsetTop } from '../../constants/screen-chrome-content-inset.constant';
import { Header } from '../header/header';
import { HeaderBackButton } from '../header-back-button/header-back-button';
import { TabBarInsetContext } from '../main-tab-layout/context/tab-bar-inset.context';
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
    const trailingContent = isDefined(trailing) ? (
        <CollapsibleHeaderTrailing>{trailing}</CollapsibleHeaderTrailing>
    ) : (
        <CollapsibleHeaderTrailing />
    );

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
                        contentInsetTop={ScreenChromeContentInsetTop}
                        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
                    >
                        {children}
                    </ScreenChromeScrollView>
                </ScreenChromeContent>

                <CollapsibleHeaderBackdrop />

                <CollapsibleHeader>
                    <CollapsibleHeaderLeading>{leadingContent}</CollapsibleHeaderLeading>
                    <CollapsibleHeaderTitleSlot>
                        <CollapsibleHeaderLargeTitle>
                            <Header numberOfLines={1} style={styles.largeTitle} text={title} />
                        </CollapsibleHeaderLargeTitle>
                    </CollapsibleHeaderTitleSlot>
                    {trailingContent}
                    <CollapsibleHeaderSmallTitle>
                        <Header numberOfLines={1} style={styles.smallTitle} text={title} />
                    </CollapsibleHeaderSmallTitle>
                </CollapsibleHeader>

                {isDefined(footer) ? <StickyFooterBand contentStyle={footerStyle}>{footer}</StickyFooterBand> : null}
            </ScreenChromeFrame>
        </ScreenChromeThemeProvider>
    );
};
