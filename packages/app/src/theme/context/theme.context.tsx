import { ColorSchemaEnum } from '@suuudokuuu/progress';
import { createContext } from 'react';

import { emptyFn } from '@rnw-community/shared';

import { BWLightTheme } from '../themes/bw.theme';

import type { ThemeContextValueInterface } from '../interface/theme-context-value.interface';

export const ThemeContext = createContext<ThemeContextValueInterface>({
    changeTheme: emptyFn,
    colorScheme: ColorSchemaEnum.Light,
    theme: BWLightTheme,
    toggleColorSchema: emptyFn
});
