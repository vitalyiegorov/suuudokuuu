import { useLingui } from '@lingui/react/macro';
import { View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { ImportEntryKindSegment } from '../import-entry-kind-segment/import-entry-kind-segment';
import { ImportScreenSelectors } from '../import-screen.selectors';

import { ImportEntryKindStyles as styles } from './import-entry-kind.styles';

import type { ImportReviewStateInterface } from '../interface/import-review-state.interface';

const digitPattern = /[1-9]/u;

interface Props {
    readonly puzzleString: string;
    readonly review: Pick<ImportReviewStateInterface, 'entryString' | 'scannedCellIndexes' | 'selectedCellIndex'>;
    readonly onToggle: () => void;
}

export const ImportEntryKind = ({ puzzleString, review, onToggle }: Props) => {
    const { t } = useLingui();
    const { entryString, scannedCellIndexes, selectedCellIndex } = review;
    const isEntry = isDefined(selectedCellIndex) && digitPattern.test(entryString[selectedCellIndex]);
    const canToggle =
        isDefined(selectedCellIndex) &&
        scannedCellIndexes.includes(selectedCellIndex) &&
        digitPattern.test(puzzleString[selectedCellIndex] + entryString[selectedCellIndex]);
    const isClueChecked = canToggle && !isEntry;
    const isEntryChecked = canToggle && isEntry;
    const clueTestId = isEntry ? ImportScreenSelectors.EntryToggleButton : ImportScreenSelectors.EntryActiveButton;
    const entryTestId = isEntry ? ImportScreenSelectors.EntryActiveButton : ImportScreenSelectors.EntryToggleButton;
    const trackStyles = [styles.track, !canToggle && styles.disabled];

    return (
        <View accessibilityLabel={t`Selected digit`} accessibilityRole="radiogroup" style={trackStyles}>
            <ImportEntryKindSegment
                isChecked={isClueChecked}
                isDisabled={!canToggle}
                onPress={onToggle}
                testID={clueTestId}
                text={t`Clue`}
            />
            <ImportEntryKindSegment
                isChecked={isEntryChecked}
                isDisabled={!canToggle}
                onPress={onToggle}
                testID={entryTestId}
                text={t`My entry`}
            />
        </View>
    );
};
