import { useLingui } from '@lingui/react/macro';
import { CellMargin, FontSizes, Languages, MotionPreferences, SettingsRepository } from '@suuudokuuu/progress';
import * as Effect from 'effect/Effect';
import { router } from 'expo-router';

import { appRuntime } from '../../@generic/runtime/app.runtime';
import { i18nActivateLanguage } from '../../@generic/utils/i18n-catalogs';
import { SettingsOptionSheetSelectors } from '../component/settings-option-sheet/settings-option-sheet.selectors';
import { useSettings } from '../query/use-settings.query';

import { useSettingsOptionDescriptions } from './use-settings-option-descriptions.hook';
import { useSettingsOptionLabels } from './use-settings-option-labels.hook';

import type { SettingsOptionSheetItemInterface } from '../interface/settings-option-sheet-item.interface';
import type { SettingsType } from '@suuudokuuu/progress';

type SettingsOptionSheetConfig = {
    readonly description: string;
    readonly items: readonly SettingsOptionSheetItemInterface[];
    readonly title: string;
};

export const useSettingsOptionSheetConfig = (setting: string | null): SettingsOptionSheetConfig | null => {
    const { t } = useLingui();
    const {
        cellMargin: currentCellMargin,
        fontSize: currentFontSize,
        language: currentLanguage,
        motionPreference: currentMotionPreference
    } = useSettings();
    const { getCellMarginDescription, getFontSizeDescription, getLanguageDescription, getMotionPreferenceDescription } =
        useSettingsOptionDescriptions();
    const { getCellMarginLabel, getFontSizeLabel, getLanguageLabel, getMotionPreferenceLabel } = useSettingsOptionLabels();

    const selectCellMargin = (cellMargin: SettingsType['cellMargin']) => {
        void appRuntime.runPromise(Effect.flatMap(SettingsRepository, settingsRepository => settingsRepository.update({ cellMargin })));
        router.back();
    };
    const selectFontSize = (fontSize: SettingsType['fontSize']) => {
        void appRuntime.runPromise(Effect.flatMap(SettingsRepository, settingsRepository => settingsRepository.update({ fontSize })));
        router.back();
    };
    const selectMotionPreference = (motionPreference: SettingsType['motionPreference']) => {
        void appRuntime.runPromise(
            Effect.flatMap(SettingsRepository, settingsRepository => settingsRepository.update({ motionPreference }))
        );
        router.back();
    };
    const selectLanguage = (language: SettingsType['language']) => {
        void appRuntime.runPromise(Effect.flatMap(SettingsRepository, settingsRepository => settingsRepository.update({ language })));
        void i18nActivateLanguage(language);
        router.back();
    };

    if (setting === 'cell-margin') {
        return {
            description: t`Choose how much space appears between Sudoku cells`,
            items: CellMargin.map(cellMargin => ({
                description: getCellMarginDescription(cellMargin),
                isSelected: cellMargin === currentCellMargin,
                label: getCellMarginLabel(cellMargin),
                onPress: () => void selectCellMargin(cellMargin)
            })),
            title: t`Cell spacing`
        };
    }

    if (setting === 'font-size') {
        return {
            description: t`Choose how large board digits appear`,
            items: FontSizes.map(fontSize => ({
                description: getFontSizeDescription(fontSize),
                isSelected: fontSize === currentFontSize,
                label: getFontSizeLabel(fontSize),
                onPress: () => void selectFontSize(fontSize)
            })),
            title: t`Number size`
        };
    }

    if (setting === 'motion') {
        return {
            description: t`Choose how much the board and screens may animate`,
            items: MotionPreferences.map(motionPreference => ({
                description: getMotionPreferenceDescription(motionPreference),
                isSelected: motionPreference === currentMotionPreference,
                label: getMotionPreferenceLabel(motionPreference),
                onPress: () => void selectMotionPreference(motionPreference)
            })),
            title: t`Animations`
        };
    }

    if (setting === 'language') {
        return {
            description: t`Choose the language used for menus and game text`,
            items: Languages.map(language => ({
                description: getLanguageDescription(language),
                isSelected: language === currentLanguage,
                label: getLanguageLabel(language),
                onPress: () => void selectLanguage(language),
                testID: `${SettingsOptionSheetSelectors.Option}.${language}`
            })),
            title: t`Language`
        };
    }

    return null;
};
