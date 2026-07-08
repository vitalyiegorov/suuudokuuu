import { View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { ScreenChromeStyles as styles } from './screen-chrome.styles';

import type { ComponentProps, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

interface Props extends ComponentProps<typeof View> {
    readonly bottomOverlay?: ReactNode;
    readonly children: ReactNode;
    readonly contentStyle?: StyleProp<ViewStyle>;
    readonly footer?: ReactNode;
    readonly footerStyle?: StyleProp<ViewStyle>;
    readonly header?: ReactNode;
    readonly headerStyle?: StyleProp<ViewStyle>;
    readonly topOverlay?: ReactNode;
}

export const ScreenChrome = (props: Props) => {
    const { bottomOverlay, children, contentStyle, footer, footerStyle, header, headerStyle, style, topOverlay, ...restProps } = props;

    const containerStyles = [styles.container, style];
    const contentStyles = [styles.content, contentStyle];
    const headerStyles = [styles.header, headerStyle];
    const footerStyles = [styles.footer, footerStyle];
    const hasFooter = isDefined(footer);
    const hasHeader = isDefined(header);
    const headerNode = hasHeader ? <View style={headerStyles}>{header}</View> : null;

    return (
        <View style={containerStyles} {...restProps}>
            <View style={contentStyles}>{children}</View>

            {topOverlay}

            {bottomOverlay}

            {headerNode}

            {hasFooter ? <View style={footerStyles}>{footer}</View> : null}
        </View>
    );
};
