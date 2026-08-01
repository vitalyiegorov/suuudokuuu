import { useLingui } from '@lingui/react/macro';
import { AppButton } from '@suuudokuuu/ui';
import { use, useState } from 'react';
import { Modal, View } from 'react-native';
import ColorPicker, { HueSlider, OpacitySlider, Panel1, Preview } from 'reanimated-color-picker';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { applyColorAlpha } from '../../../@generic/utils/apply-color-alpha.util';
import { ThemeContext } from '../../../theme/context/theme.context';

import { ThemeEditorColorSheetStyles as styles } from './theme-editor-color-sheet.styles';

import type { OnEventFn } from '@rnw-community/shared';

interface Props {
    readonly initialValue: string;
    readonly isVisible: boolean;
    readonly label: string;
    readonly onCancel: OnEventFn;
    readonly onConfirm: OnEventFn<string>;
}

export const ThemeEditorColorSheet = ({ initialValue, isVisible, label, onCancel, onConfirm }: Props) => {
    const { theme } = use(ThemeContext);
    const { t } = useLingui();
    const [selectedColor, setSelectedColor] = useState(initialValue);

    const handleColorComplete = ({ rgba }: { readonly rgba: string }) => {
        setSelectedColor(rgba);
    };
    const handleConfirm = () => {
        onConfirm(selectedColor);
    };

    const backdropStyles = [styles.backdrop, { backgroundColor: applyColorAlpha(theme.colors.ink, 0.5) }];
    const cardStyles = [styles.card, { backgroundColor: theme.colors.surface.raised }];
    const titleStyles = [styles.title, { color: theme.colors.surface.raisedText }];

    return (
        <Modal animationType="fade" onRequestClose={onCancel} transparent visible={isVisible}>
            <View style={backdropStyles}>
                <View style={cardStyles}>
                    <BlackText style={titleStyles}>{label}</BlackText>

                    <ColorPicker onCompleteJS={handleColorComplete} style={styles.picker} value={initialValue}>
                        <Preview hideInitialColor />
                        <Panel1 />
                        <HueSlider />
                        <OpacitySlider />
                    </ColorPicker>

                    <View style={styles.actions}>
                        <AppButton onPress={onCancel} size="compact" text={t`Cancel`} variant="secondary" />
                        <AppButton onPress={handleConfirm} size="compact" text={t`Apply`} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};
