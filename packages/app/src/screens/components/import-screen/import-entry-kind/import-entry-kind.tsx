import { useLingui } from '@lingui/react/macro';
import { View } from 'react-native';

import { ImportEntryKindSegment } from '../import-entry-kind-segment/import-entry-kind-segment';
import { ImportScreenSelectors } from '../import-screen.selectors';

import { ImportEntryKindStyles as styles } from './import-entry-kind.styles';

interface Props {
    readonly isEntry: boolean;
    readonly onToggle: () => void;
}

export const ImportEntryKind = ({ isEntry, onToggle }: Props) => {
    const { t } = useLingui();
    const clueTestId = isEntry ? ImportScreenSelectors.EntryToggleButton : ImportScreenSelectors.EntryActiveButton;
    const entryTestId = isEntry ? ImportScreenSelectors.EntryActiveButton : ImportScreenSelectors.EntryToggleButton;

    return (
        <View accessibilityLabel={t`Selected digit`} accessibilityRole="radiogroup" style={styles.container}>
            <View pointerEvents="none" style={styles.track} />
            <ImportEntryKindSegment isChecked={!isEntry} onPress={onToggle} testID={clueTestId} text={t`Clue`} />
            <ImportEntryKindSegment isChecked={isEntry} onPress={onToggle} testID={entryTestId} text={t`My entry`} />
        </View>
    );
};
