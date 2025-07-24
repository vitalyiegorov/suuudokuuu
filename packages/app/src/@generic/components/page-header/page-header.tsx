import { useLingui } from '@lingui/react/macro';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { isNotEmptyString } from '@rnw-community/shared';

import { useHtmlThemeColor } from '../../hooks/use-html-theme-color.hook';

interface Props {
    readonly title?: string;
}

export const PageHeader = ({ title = '' }: Props) => {
    const theme = useColorScheme();
    const { t } = useLingui();

    const pageTitle = t`SuuudokuuU The Game`;
    const fullTitle = isNotEmptyString(title) ? `${pageTitle} - ${title}` : pageTitle;
    const baseColor = theme === 'dark' ? '#010101' : '#f2f2f2';

    useHtmlThemeColor(baseColor);

    return (
        <>
            {/* eslint-disable-next-line react/style-prop-object */}
            <StatusBar style="auto" />

            <Stack.Screen options={{ title: fullTitle }} />
        </>
    );
};
