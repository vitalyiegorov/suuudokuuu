import { useLingui } from '@lingui/react/macro';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { use } from 'react';

import { isNotEmptyString } from '@rnw-community/shared';

import { ThemeContext } from '../../context/theme.context';
import { useHtmlThemeColor } from '../../hooks/use-html-theme-color.hook';

interface Props {
    readonly title?: string;
}

export const PageHeader = ({ title = '' }: Props) => {
    const { colorScheme } = use(ThemeContext);
    const { t } = useLingui();

    const pageTitle = t`SuuudokuuU The Game`;
    const fullTitle = isNotEmptyString(title) ? `${pageTitle} - ${title}` : pageTitle;
    const baseColor = colorScheme === 'dark' ? '#010101' : '#f2f2f2';

    useHtmlThemeColor(baseColor);

    return (
        <>
            {/* eslint-disable-next-line react/style-prop-object */}
            <StatusBar style={colorScheme} />

            <Stack.Screen options={{ title: fullTitle }} />
        </>
    );
};
