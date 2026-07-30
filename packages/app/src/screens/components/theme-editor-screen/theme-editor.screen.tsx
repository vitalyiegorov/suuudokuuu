import { useLingui } from '@lingui/react/macro';
import { AppButton, AppSettingsSection, resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { router, useLocalSearchParams } from 'expo-router';
import { RotateCcw } from 'lucide-react-native';
import { use, useState } from 'react';
import { Alert, TextInput, View } from 'react-native';

import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { CollapsibleChromePage } from '../../../@generic/components/collapsible-chrome-page/collapsible-chrome-page';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { ThemeEditorColorRow } from '../../../settings/component/theme-editor-color-row/theme-editor-color-row';
import { ThemeEditorColorSheet } from '../../../settings/component/theme-editor-color-sheet/theme-editor-color-sheet';
import { ThemePreviewBoard } from '../../../settings/component/theme-preview-board/theme-preview-board';
import { useThemeTokenLabels } from '../../../settings/hooks/use-theme-token-labels.hook';
import { settingsKeySelector, settingsThemeSelector } from '../../../settings/store/settings.selectors';
import { ThemeEditorSections } from '../../../theme/constant/theme-editor-sections.constant';
import { ThemeContext } from '../../../theme/context/theme.context';
import { ColorSchemaEnum } from '../../../theme/enum/color-schema.enum';
import { CustomThemeNameMaxLength } from '../../../theme/schema/custom-theme.schema';
import { customThemesRemoveAction, customThemesUpsertAction } from '../../../theme/store/custom-themes.actions';
import { customThemesSelector } from '../../../theme/store/custom-themes.selectors';
import { isCustomThemeId } from '../../../theme/type-guard/is-custom-theme-id.type-guard';
import { isPresetThemeId } from '../../../theme/type-guard/is-preset-theme-id.type-guard';
import { cloneThemeColors } from '../../../theme/utils/clone-theme-colors.util';
import { createCustomTheme } from '../../../theme/utils/create-custom-theme.util';
import { getTheme } from '../../../theme/utils/get-theme.util';
import { validateCustomThemeColors } from '../../../theme/utils/validate-custom-theme-colors.util';

import { ThemeEditorScreenSelectors } from './theme-editor-screen.selectors';
import { ThemeEditorScreenStyles as styles } from './theme-editor-screen.styles';

import type { ThemeEditorTokenInterface } from '../../../theme/interface/theme-editor-token.interface';
import type { ThemeIdType } from '../../../theme/types/theme-id.type';

// eslint-disable-next-line max-lines-per-function -- Layout/form component requires many lines
export const ThemeEditorScreen = () => {
    const { t } = useLingui();
    const { customThemeId, sourceThemeId } = useLocalSearchParams<{ customThemeId?: string; sourceThemeId?: string }>();
    const dispatch = useAppDispatch();
    const { changeTheme, theme } = use(ThemeContext);
    const customThemes = useAppSelector(customThemesSelector);
    const activeThemeId = useAppSelector(settingsThemeSelector);
    const isDarkColorSchema = useAppSelector(settingsKeySelector('isDarkColorSchema'));
    const { getSectionTitle, getTokenLabel } = useThemeTokenLabels();

    const existingTheme = customThemes.find(customTheme => customTheme.id === customThemeId);
    const isExistingTheme = isDefined(existingTheme);
    const initialVariant = isDarkColorSchema ? ColorSchemaEnum.Dark : ColorSchemaEnum.Light;
    const resolvedSourceThemeId: ThemeIdType =
        isNotEmptyString(sourceThemeId) && (isCustomThemeId(sourceThemeId) || isPresetThemeId(sourceThemeId))
            ? sourceThemeId
            : activeThemeId;

    const [draftTheme, setDraftTheme] = useState(
        () => existingTheme ?? createCustomTheme(t`My theme`, resolvedSourceThemeId, customThemes, Date.now())
    );
    const [variant, setVariant] = useState<ColorSchemaEnum>(initialVariant);
    const [editedToken, setEditedToken] = useState<ThemeEditorTokenInterface | null>(null);
    const [hasNameError, setHasNameError] = useState(false);

    const draftColors = draftTheme.colors[variant];
    const contrastIssues = validateCustomThemeColors(draftColors);

    const handleNameChange = (name: string) => {
        setHasNameError(false);
        setDraftTheme(currentDraft => ({ ...currentDraft, name }));
    };
    const handleTokenConfirm = (value: string) => {
        if (isDefined(editedToken)) {
            setDraftTheme(currentDraft => ({
                ...currentDraft,
                colors: { ...currentDraft.colors, [variant]: editedToken.setValue(currentDraft.colors[variant], value) }
            }));
        }
        setEditedToken(null);
    };
    const persistDraft = () => {
        dispatch(customThemesUpsertAction({ ...draftTheme, name: draftTheme.name.trim(), updatedAt: Date.now() }));
        changeTheme(draftTheme.id);
        router.back();
    };
    const handleSave = () => {
        if (!isNotEmptyString(draftTheme.name.trim())) {
            setHasNameError(true);

            return;
        }

        if (contrastIssues.length > 0) {
            Alert.alert(t`Low contrast`, t`Some color combinations are hard to read. Save anyway?`, [
                { text: t`Cancel`, style: 'cancel' },
                { text: t`Save anyway`, onPress: persistDraft }
            ]);

            return;
        }

        persistDraft();
    };
    const handleDelete = () => {
        Alert.alert(t`Delete theme`, t`This theme will be removed permanently.`, [
            { text: t`Cancel`, style: 'cancel' },
            {
                text: t`Delete`,
                style: 'destructive',
                onPress: () => {
                    dispatch(customThemesRemoveAction({ id: draftTheme.id }));

                    if (activeThemeId === draftTheme.id) {
                        changeTheme(draftTheme.sourceTheme);
                    }

                    router.back();
                }
            }
        ]);
    };
    const handleReset = () => {
        setDraftTheme(currentDraft => ({
            ...currentDraft,
            colors: {
                [ColorSchemaEnum.Light]: cloneThemeColors(getTheme(currentDraft.sourceTheme, ColorSchemaEnum.Light).colors),
                [ColorSchemaEnum.Dark]: cloneThemeColors(getTheme(currentDraft.sourceTheme, ColorSchemaEnum.Dark).colors)
            }
        }));
    };
    const handleDuplicate = () => {
        const draftThemeName = draftTheme.name;
        const duplicateName = t`${draftThemeName} copy`;

        dispatch(customThemesUpsertAction(createCustomTheme(duplicateName, draftTheme.id, customThemes, Date.now())));
        router.back();
    };
    const handleSelectLightVariant = () => void setVariant(ColorSchemaEnum.Light);
    const handleSelectDarkVariant = () => void setVariant(ColorSchemaEnum.Dark);
    const handleColorSheetCancel = () => void setEditedToken(null);

    const nameInputStyles = [
        styles.nameInput,
        {
            backgroundColor: theme.colors.surface.raised,
            borderColor: hasNameError ? theme.colors.red : theme.colors.value.border,
            color: theme.colors.surface.raisedText
        }
    ];
    const warningTextStyles = [styles.warning, { color: theme.colors.red }];
    const editedTokenValue = isDefined(editedToken) ? editedToken.getValue(draftColors) : '';
    const editedTokenLabel = isDefined(editedToken) ? getTokenLabel(editedToken.key) : '';
    const lightVariantButtonVariant = variant === ColorSchemaEnum.Light ? 'primary' : 'secondary';
    const darkVariantButtonVariant = variant === ColorSchemaEnum.Dark ? 'primary' : 'secondary';
    const footer = (
        <>
            <AppButton accessibilityLabel={t`Reset`} icon={RotateCcw} onPress={handleReset} size="large" variant="secondary" />
            <AppButton
                onPress={handleSave}
                size="large"
                style={styles.saveButton}
                testID={ThemeEditorScreenSelectors.SaveButton}
                text={t`Save`}
            />
        </>
    );

    return (
        <CollapsibleChromePage
            contentContainerStyle={resolveUnistyleForAnimated(styles.scrollContent)}
            footer={footer}
            footerStyle={styles.footer}
            testID={ThemeEditorScreenSelectors.Root}
            title={t`Theme editor`}
        >
            <TextInput
                maxLength={CustomThemeNameMaxLength}
                onChangeText={handleNameChange}
                placeholder={t`Theme name`}
                placeholderTextColor={theme.colors.label.hint}
                style={nameInputStyles}
                testID={ThemeEditorScreenSelectors.NameInput}
                value={draftTheme.name}
            />
            {hasNameError && <BlackText style={warningTextStyles}>{t`Enter a theme name`}</BlackText>}

            <View style={styles.variantRow}>
                <AppButton
                    onPress={handleSelectLightVariant}
                    size="compact"
                    style={styles.variantButton}
                    text={t`Light`}
                    variant={lightVariantButtonVariant}
                />
                <AppButton
                    onPress={handleSelectDarkVariant}
                    size="compact"
                    style={styles.variantButton}
                    text={t`Dark`}
                    variant={darkVariantButtonVariant}
                />
            </View>

            <ThemePreviewBoard colors={draftColors} />

            {contrastIssues.map(issue => {
                const foregroundLabel = getTokenLabel(issue.foregroundKey);
                const backgroundLabel = getTokenLabel(issue.backgroundKey);
                const contrastRatioText = issue.contrastRatio.toFixed(1);
                const { minimumRatio } = issue;

                return (
                    <BlackText key={`${issue.foregroundKey}-${issue.backgroundKey}`} style={warningTextStyles}>
                        {t`${foregroundLabel} on ${backgroundLabel}: ${contrastRatioText} — minimum ${minimumRatio}`}
                    </BlackText>
                );
            })}

            {ThemeEditorSections.map(section => (
                <AppSettingsSection key={section.key} title={getSectionTitle(section.key)}>
                    {section.tokens.map(token => {
                        const handleTokenPress = () => void setEditedToken(token);
                        const tokenValue = token.getValue(draftColors);

                        return (
                            <ThemeEditorColorRow
                                key={token.key}
                                label={getTokenLabel(token.key)}
                                onPress={handleTokenPress}
                                value={tokenValue}
                            />
                        );
                    })}
                </AppSettingsSection>
            ))}

            {isExistingTheme && (
                <View style={styles.actionsRow}>
                    <AppButton
                        onPress={handleDuplicate}
                        size="compact"
                        style={styles.actionButton}
                        text={t`Duplicate`}
                        variant="secondary"
                    />
                    <AppButton
                        onPress={handleDelete}
                        size="compact"
                        style={styles.actionButton}
                        testID={ThemeEditorScreenSelectors.DeleteButton}
                        text={t`Delete`}
                        variant="secondary"
                    />
                </View>
            )}

            {isDefined(editedToken) && (
                <ThemeEditorColorSheet
                    initialValue={editedTokenValue}
                    isVisible
                    label={editedTokenLabel}
                    onCancel={handleColorSheetCancel}
                    onConfirm={handleTokenConfirm}
                />
            )}
        </CollapsibleChromePage>
    );
};
