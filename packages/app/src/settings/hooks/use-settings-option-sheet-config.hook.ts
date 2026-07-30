import { useLingui } from '@lingui/react/macro';
import { router } from 'expo-router';

import { useAppDispatch } from '../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../@generic/hooks/use-app-selector.hook';
import { CellMargin } from '../constant/cell-margin.constant';
import { FontSizes } from '../constant/font-sizes.constant';
import { Languages } from '../constant/languages.constant';
import { settingsSetAction } from '../store/settings.actions';
import { settingsCellMarginSelector, settingsFontSizeSelector, settingsLanguageSelector } from '../store/settings.selectors';

import { useSettingsOptionDescriptions } from './use-settings-option-descriptions.hook';
import { useSettingsOptionLabels } from './use-settings-option-labels.hook';

import type { SettingsOptionSheetItemInterface } from '../interface/settings-option-sheet-item.interface';
import type { SettingsState } from '../store/settings.state';

type SettingsOptionSheetConfig = {
    readonly description: string;
    readonly items: readonly SettingsOptionSheetItemInterface[];
    readonly title: string;
};

export const useSettingsOptionSheetConfig = (setting: string | null): SettingsOptionSheetConfig | null => {
    const { i18n, t } = useLingui();
    const dispatch = useAppDispatch();
    const currentCellMargin = useAppSelector(settingsCellMarginSelector);
    const currentFontSize = useAppSelector(settingsFontSizeSelector);
    const currentLanguage = useAppSelector(settingsLanguageSelector);
    const { getCellMarginDescription, getFontSizeDescription, getLanguageDescription } = useSettingsOptionDescriptions();
    const { getCellMarginLabel, getFontSizeLabel, getLanguageLabel } = useSettingsOptionLabels();

    const selectCellMargin = (cellMargin: SettingsState['cellMargin']) => {
        dispatch(settingsSetAction({ cellMargin }));
        router.back();
    };
    const selectFontSize = (fontSize: SettingsState['fontSize']) => {
        dispatch(settingsSetAction({ fontSize }));
        router.back();
    };
    const selectLanguage = (language: SettingsState['language']) => {
        dispatch(settingsSetAction({ language }));
        i18n.activate(language);
        router.back();
    };

    const cellMarginItems = CellMargin.map(cellMargin => ({
        description: getCellMarginDescription(cellMargin),
        isSelected: cellMargin === currentCellMargin,
        label: getCellMarginLabel(cellMargin),
        onPress: () => void selectCellMargin(cellMargin)
    }));
    const fontSizeItems = FontSizes.map(fontSize => ({
        description: getFontSizeDescription(fontSize),
        isSelected: fontSize === currentFontSize,
        label: getFontSizeLabel(fontSize),
        onPress: () => void selectFontSize(fontSize)
    }));
    const languageItems = Languages.map(language => ({
        description: getLanguageDescription(language),
        isSelected: language === currentLanguage,
        label: getLanguageLabel(language),
        onPress: () => void selectLanguage(language)
    }));

    if (setting === 'cell-margin') {
        return {
            description: t`Choose how much space appears between Sudoku cells`,
            items: cellMarginItems,
            title: t`Cell spacing`
        };
    }

    if (setting === 'font-size') {
        return {
            description: t`Choose how large board digits appear`,
            items: fontSizeItems,
            title: t`Number size`
        };
    }

    if (setting === 'language') {
        return {
            description: t`Choose the language used for menus and game text`,
            items: languageItems,
            title: t`Language`
        };
    }

    return null;
};
