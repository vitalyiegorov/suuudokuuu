import type { BWDarkTheme } from '../themes/bw.theme';
import type { OnEventFn } from '@rnw-community/shared';
import type { ColorSchemaEnum, SettingsType } from '@suuudokuuu/progress';

export interface ThemeContextValueInterface {
    readonly changeTheme: OnEventFn<SettingsType['theme']>;
    readonly colorScheme: ColorSchemaEnum;
    readonly theme: typeof BWDarkTheme;
}
