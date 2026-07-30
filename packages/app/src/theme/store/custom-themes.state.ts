import type { CustomThemeInterface } from '../interface/custom-theme.interface';

export interface CustomThemesState {
    readonly themes: readonly CustomThemeInterface[];
}

export const initialCustomThemesState: CustomThemesState = { themes: [] };
