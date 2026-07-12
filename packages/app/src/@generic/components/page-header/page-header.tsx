import { useLingui } from '@lingui/react/macro';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { use } from 'react';

import { isNotEmptyString } from '@rnw-community/shared';

import { ThemeContext } from '../../../theme/context/theme.context';
import { ColorSchemaEnum } from '../../../theme/enum/color-schema.enum';
import { useHtmlThemeColor } from '../../hooks/use-html-theme-color.hook';

interface Props {
    readonly title?: string;
}

export const PageHeader = ({ title = '' }: Props) => {
    const { colorScheme, theme } = use(ThemeContext);
    const { t } = useLingui();

    const pageTitle = t`SuuudokuuU The Game`;
    const statusBarStyle = colorScheme === ColorSchemaEnum.Dark ? 'light' : 'dark';
    const screenTitle = isNotEmptyString(title) ? title : pageTitle;

    useHtmlThemeColor(theme.colors.background);

    const options = { title: screenTitle };

    return (
        <>
            <StatusBar style={statusBarStyle} />

            <Stack.Screen options={options} />
        </>
    );
};
