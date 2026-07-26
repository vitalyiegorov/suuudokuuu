import type { UnistylesThemeNameType } from '../constant/unistyles-themes.constant';

interface UnistylesThemeRuntime {
    readonly themeName?: UnistylesThemeNameType;
    readonly setTheme: (themeName: UnistylesThemeNameType) => void;
}

export const synchronizeUnistylesTheme = (runtime: UnistylesThemeRuntime, themeName: UnistylesThemeNameType) => {
    if (runtime.themeName !== themeName) {
        runtime.setTheme(themeName);
    }
};
