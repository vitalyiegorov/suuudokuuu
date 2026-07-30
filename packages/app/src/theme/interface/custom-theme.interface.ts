import type { ColorSchemaEnum } from '../enum/color-schema.enum';
import type { ThemeEnum } from '../enum/theme.enum';
import type { CustomThemeIdType } from '../types/theme-id.type';
import type { ThemeInterface } from '@suuudokuuu/ui/theme';

export interface CustomThemeInterface {
    readonly id: CustomThemeIdType;
    readonly name: string;
    readonly schemaVersion: number;
    readonly sourceTheme: ThemeEnum;
    readonly colors: {
        readonly [ColorSchemaEnum.Light]: ThemeInterface['colors'];
        readonly [ColorSchemaEnum.Dark]: ThemeInterface['colors'];
    };
    readonly createdAt: number;
    readonly updatedAt: number;
}
