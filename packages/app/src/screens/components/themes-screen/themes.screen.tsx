import { useLingui } from '@lingui/react/macro';
import { AppButton, AppSettingsSection, resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { router } from 'expo-router';
import { use } from 'react';

import { isNotEmptyArray } from '@rnw-community/shared';

import { CollapsibleChromePage } from '../../../@generic/components/collapsible-chrome-page/collapsible-chrome-page';
import { StickyFooterBand } from '../../../@generic/components/sticky-footer-band/sticky-footer-band';
import { ThemeListRowEditButton } from '../../../settings/component/theme-list-row-edit-button/theme-list-row-edit-button';
import { ThemeListRow } from '../../../settings/component/theme-list-row/theme-list-row';
import { useSettingsOptionDescriptions } from '../../../settings/hooks/use-settings-option-descriptions.hook';
import { useSettingsOptionLabels } from '../../../settings/hooks/use-settings-option-labels.hook';
import { useSettings } from '../../../settings/query/use-settings.query';
import { Themes } from '../../../theme/constant/themes.constant';
import { ThemeContext } from '../../../theme/context/theme.context';
import { useCustomThemes } from '../../../theme/query/use-custom-themes.query';

import { ThemesScreenSelectors } from './themes-screen.selectors';
import { ThemesScreenStyles as styles } from './themes-screen.styles';

export const ThemesScreen = () => {
    const { t } = useLingui();
    const { changeTheme } = use(ThemeContext);
    const activeThemeId = useSettings().theme;
    const customThemes = useCustomThemes();
    const { getThemeLabel } = useSettingsOptionLabels();
    const { getThemeDescription } = useSettingsOptionDescriptions();

    const handleCreate = () => {
        router.push({ pathname: '/settings/themes/editor', params: { sourceThemeId: activeThemeId } });
    };

    const footer = (
        <StickyFooterBand contentStyle={styles.footer}>
            <AppButton onPress={handleCreate} size="large" testID={ThemesScreenSelectors.CreateButton} text={t`Create theme`} />
        </StickyFooterBand>
    );

    return (
        <CollapsibleChromePage
            contentContainerStyle={resolveUnistyleForAnimated(styles.scrollContent)}
            footer={footer}
            style={resolveUnistyleForAnimated(styles.scrollView)}
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
                            isSelected={isPresetSelected}
                            key={presetTheme}
                            onPress={handlePresetPress}
                            title={getThemeLabel(presetTheme)}
                        >
                            <ThemeListRowEditButton accessibilityLabel={t`Customize`} onPress={handlePresetEdit} />
                        </ThemeListRow>
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
                                isSelected={isCustomThemeSelected}
                                key={customTheme.id}
                                onPress={handleCustomThemePress}
                                title={customTheme.name}
                            >
                                <ThemeListRowEditButton accessibilityLabel={t`Edit`} onPress={handleCustomThemeEdit} />
                            </ThemeListRow>
                        );
                    })}
                </AppSettingsSection>
            )}
        </CollapsibleChromePage>
    );
};
