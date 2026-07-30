import { useLingui } from '@lingui/react/macro';
import { AppSettingsRow } from '@suuudokuuu/ui';
import { use } from 'react';
import { Pressable, View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';

import { ThemeEditorColorRowStyles as styles } from './theme-editor-color-row.styles';

import type { OnEventFn } from '@rnw-community/shared';

interface Props {
    readonly label: string;
    readonly onPress: OnEventFn;
    readonly testID?: string;
    readonly value: string;
}

export const ThemeEditorColorRow = ({ label, onPress, testID, value }: Props) => {
    const { theme } = use(ThemeContext);
    const { t } = useLingui();

    const swatchFrameStyles = [styles.swatchFrame, { borderColor: theme.colors.value.border }];
    const swatchStyles = [styles.swatch, { backgroundColor: value }];
    const accessibilityValue = { text: value };
    const trailing = (
        <View style={swatchFrameStyles}>
            <View style={swatchStyles} />
        </View>
    );

    return (
        <Pressable
            accessibilityHint={t`Opens a color picker for this token`}
            accessibilityLabel={label}
            accessibilityRole="button"
            accessibilityValue={accessibilityValue}
            onPress={onPress}
            style={styles.pressable}
            testID={testID}
        >
            <AppSettingsRow title={label} trailing={trailing} />
        </Pressable>
    );
};
