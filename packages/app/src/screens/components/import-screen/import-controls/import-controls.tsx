import { View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { HiddenFromAccessibilityPropsConstant } from '../../../../game/constant/hidden-from-accessibility-props.constant';
import { ImportCellPad } from '../import-cell-pad/import-cell-pad';
import { ImportEntryKind } from '../import-entry-kind/import-entry-kind';

import { ImportControlsStyles as styles } from './import-controls.styles';

import type { ImportReviewStateInterface } from '../interface/import-review-state.interface';

const digitPattern = /[1-9]/u;

interface Props {
    readonly puzzleString: string;
    readonly review: ImportReviewStateInterface;
    readonly onInput: (value: number) => void;
    readonly onToggle: () => void;
}

export const ImportControls = ({ puzzleString, review, onInput, onToggle }: Props) => {
    const { entryString, scannedCellIndexes, selectedCellIndex } = review;

    const isIdle = !isDefined(selectedCellIndex);
    const isEntry = !isIdle && digitPattern.test(entryString[selectedCellIndex]);
    const isEntryKindHidden =
        isIdle || !scannedCellIndexes.includes(selectedCellIndex) || !(isEntry || digitPattern.test(puzzleString[selectedCellIndex]));
    const keysStyles = [styles.keys, { opacity: isIdle ? 0 : 1 }];
    const entryKindStyles = { opacity: isEntryKindHidden ? 0 : 1 };
    const keysPointerEvents = isIdle ? 'none' : 'auto';
    const entryKindPointerEvents = isEntryKindHidden ? 'none' : 'auto';

    return (
        <View style={styles.controls}>
            <View pointerEvents={keysPointerEvents} style={keysStyles} {...(isIdle && HiddenFromAccessibilityPropsConstant)}>
                <View
                    pointerEvents={entryKindPointerEvents}
                    style={entryKindStyles}
                    {...(isEntryKindHidden && HiddenFromAccessibilityPropsConstant)}
                >
                    <ImportEntryKind isEntry={isEntry} onToggle={onToggle} />
                </View>
                <ImportCellPad isDisabled={isIdle} onInput={onInput} />
            </View>
        </View>
    );
};
