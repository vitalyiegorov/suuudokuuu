import { Trans, useLingui } from '@lingui/react/macro';
import LucideClipboardPaste from 'lucide-react-native/icons/clipboard-paste';
import LucideImage from 'lucide-react-native/icons/image';
import LucidePencil from 'lucide-react-native/icons/pencil';
import LucideScanLine from 'lucide-react-native/icons/scan-line';
import { use } from 'react';
import { Pressable, View, useWindowDimensions } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { ImportScreenSelectors } from '../import-screen.selectors';
import { ImportSourceChip } from '../import-source-chip/import-source-chip';

import { ImportSourcesStyles as styles } from './import-sources.styles';

interface Props {
    readonly onScan: () => void;
    readonly onPhotos: () => void;
    readonly onPaste: () => void;
    readonly onType: () => void;
}

export const ImportSources = ({ onScan, onPhotos, onPaste, onType }: Props) => {
    const { t } = useLingui();
    const { fontScale } = useWindowDimensions();
    const heroStyles = [styles.hero, fontScale >= 2 && styles.compactHero];
    const { theme } = use(ThemeContext);

    return (
        <View style={styles.sources} testID={ImportScreenSelectors.Sources}>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={t`Scan a puzzle`}
                onPress={onScan}
                style={heroStyles}
                testID={ImportScreenSelectors.ScanButton}
            >
                <LucideScanLine color={theme.colors.inkText} size={32} />
                <BlackText style={styles.title}>
                    <Trans>Scan a puzzle</Trans>
                </BlackText>
                <BlackText style={styles.subtitle}>
                    <Trans>Newspaper, book or screen</Trans>
                </BlackText>
            </Pressable>
            <View style={styles.chips}>
                <ImportSourceChip icon={LucideImage} onPress={onPhotos} testID={ImportScreenSelectors.PhotosButton} text={t`Photos`} />
                <ImportSourceChip
                    icon={LucideClipboardPaste}
                    onPress={onPaste}
                    testID={ImportScreenSelectors.PasteButton}
                    text={t`Paste`}
                />
                <ImportSourceChip icon={LucidePencil} onPress={onType} testID={ImportScreenSelectors.TypeButton} text={t`Type it in`} />
            </View>
            <BlackText style={styles.footer}>
                <Trans>Recognized on your device</Trans>
            </BlackText>
        </View>
    );
};
