import { useLingui } from '@lingui/react';
import { useEffect } from 'react';
import { Platform, View } from 'react-native';

import { i18nIsRightToLeftLocale } from '../../utils/i18n-is-right-to-left-locale.util';

import { LayoutDirectionViewStyles as styles } from './layout-direction-view.styles';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const LayoutDirectionView = ({ children }: Props) => {
    const {
        i18n: { locale }
    } = useLingui();

    const direction = i18nIsRightToLeftLocale(locale) ? 'rtl' : 'ltr';

    useEffect(() => {
        if (Platform.OS === 'web') {
            document.documentElement.dir = direction;
            document.documentElement.lang = locale;
        }
    }, [direction, locale]);

    return <View style={styles.root(direction)}>{children}</View>;
};
