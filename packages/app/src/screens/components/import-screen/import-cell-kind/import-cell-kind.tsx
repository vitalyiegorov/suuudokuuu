import { isDefined, isNotEmptyArray } from '@rnw-community/shared';

import { ImportEntryKind } from '../import-entry-kind/import-entry-kind';
import { ImportLegend } from '../import-legend/import-legend';

import type { ImportReviewStateInterface } from '../interface/import-review-state.interface';

const digitPattern = /[1-9]/u;

interface Props {
    readonly puzzleString: string;
    readonly review: ImportReviewStateInterface;
    readonly onToggle: () => void;
}

export const ImportCellKind = ({ puzzleString, review, onToggle }: Props) => {
    const { entryString, scannedCellIndexes, selectedCellIndex } = review;

    if (!isNotEmptyArray(scannedCellIndexes)) {
        return null;
    }

    const isEntry = isDefined(selectedCellIndex) && digitPattern.test(entryString[selectedCellIndex]);
    const isScannedDigit =
        isDefined(selectedCellIndex) &&
        scannedCellIndexes.includes(selectedCellIndex) &&
        (isEntry || digitPattern.test(puzzleString[selectedCellIndex]));

    return isScannedDigit ? (
        <ImportEntryKind isEntry={isEntry} onToggle={onToggle} />
    ) : (
        <ImportLegend puzzleString={puzzleString} review={review} />
    );
};
