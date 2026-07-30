import { useLingui } from '@lingui/react/macro';
import { AppButton, AppSettingsSection, resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { router } from 'expo-router';
import { use } from 'react';

import { isNotEmptyArray } from '@rnw-community/shared';

import { CollapsibleChromePage } from '../../../@generic/components/collapsible-chrome-page/collapsible-chrome-page';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { ThemeListRow } from '../../../settings/component/theme-list-row/theme-list-row';
import { useSettingsOptionDescriptions } from '../../../settings/hooks/use-settings-option-descriptions.hook';
import { useSettingsOptionLabels } from '../../../settings/hooks/use-settings-option-labels.hook';
import { settingsThemeSelector } from '../../../settings/store/settings.selectors';
import { Themes } from '../../../theme/constant/themes.constant';
import { ThemeContext } from '../../../theme/context/theme.context';
import { customThemesSelector } from '../../../theme/store/custom-themes.selectors';

import { ThemesScreenSelectors } from './themes-screen.selectors';
import { ThemesScreenStyles as styles } from './themes-screen.styles';

export const ThemesScreen = () => {
    const { t } = useLingui();
    const { changeTheme } = use(ThemeContext);
    const activeThemeId = useAppSelector(settingsThemeSelector);
    const customThemes = useAppSelector(customThemesSelector);
    const { getThemeLabel } = useSettingsOptionLabels();
    const { getThemeDescription } = useSettingsOptionDescriptions();

    const handleCreate = () => {
        router.push({ pathname: '/settings/themes/editor', params: { sourceThemeId: activeThemeId } });
    };

    const footer = <AppButton onPress={handleCreate} size="large" testID={ThemesScreenSelectors.CreateButton} text={t`Create theme`} />;

    return (
        <CollapsibleChromePage
            contentContainerStyle={resolveUnistyleForAnimated(styles.scrollContent)}
            footer={footer}
            footerStyle={styles.footer}
            testID={ThemesScreenSelectors.Root}
            title={t`Theme`}
        >
            <AppSettingsSection title={t`Presets`}>
                {Themes.map(presetTheme => {
                    const handlePresetPress = () => void changeTheme(presetTheme);
                    const handlePresetEdit = () =>
                        void router.push({ pathname: '/settings/themes/editor', params: { sourceThemeId: presetTheme } });
                    const isPresetSelected = presetTheme === activeThemeId;

                    return (
                        <ThemeListRow
                            description={getThemeDescription(presetTheme)}
                            editLabel={t`Customize`}
                            isSelected={isPresetSelected}
                            key={presetTheme}
                            onEdit={handlePresetEdit}
                            onPress={handlePresetPress}
                            title={getThemeLabel(presetTheme)}
                        />
                    );
                })}
            </AppSettingsSection>

            {isNotEmptyArray(customThemes) && (
                <AppSettingsSection title={t`My themes`}>
                    {customThemes.map(customTheme => {
                        const handleCustomThemePress = () => void changeTheme(customTheme.id);
                        const handleCustomThemeEdit = () =>
                            void router.push({ pathname: '/settings/themes/editor', params: { customThemeId: customTheme.id } });
                        const isCustomThemeSelected = customTheme.id === activeThemeId;

                        return (
                            <ThemeListRow
                                editLabel={t`Edit`}
                                isSelected={isCustomThemeSelected}
                                key={customTheme.id}
                                onEdit={handleCustomThemeEdit}
                                onPress={handleCustomThemePress}
                                title={customTheme.name}
                            />
                        );
                    })}
                </AppSettingsSection>
            )}
        </CollapsibleChromePage>
    );
};
