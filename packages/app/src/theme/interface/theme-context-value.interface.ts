import type { SettingsState } from '../../settings/store/settings.state';
import type { ColorSchemaEnum } from '../enum/color-schema.enum';
import type { BWDarkTheme } from '../themes/bw.theme';
import type { OnEventFn } from '@rnw-community/shared';

export interface ThemeContextValueInterface {
    readonly changeTheme: OnEventFn<SettingsState['theme']>;
    readonly colorScheme: ColorSchemaEnum;
    readonly theme: typeof BWDarkTheme;
    readonly toggleColorSchema: OnEventFn;
}
