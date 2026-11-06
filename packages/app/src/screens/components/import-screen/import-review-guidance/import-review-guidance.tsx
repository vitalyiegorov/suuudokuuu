import { plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { getMatchingEntryCellIndexes, isImportedPuzzleCompleted } from '@suuudokuuu/puzzle-forge';

import { isDefined } from '@rnw-community/shared';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { ImportScreenSelectors } from '../import-screen.selectors';

import { ImportReviewGuidanceStyles as styles } from './import-review-guidance.styles';

import type { SerializedPuzzleInterface } from '@suuudokuuu/puzzle-forge';

interface Props {
    readonly clueString: string;
    readonly entryString: string;
    readonly assessment: Pick<SerializedPuzzleInterface, 'solutionString'> | null;
    readonly uncertainCellCount: number;
}

export const ImportReviewGuidance = ({ clueString, entryString, assessment, uncertainCellCount }: Props) => {
    const { t } = useLingui();
    const solutionString = assessment?.solutionString ?? null;
    const entryCount = Array.from(entryString).filter(digit => /[1-9]/u.test(digit)).length;
    const keptCount = isDefined(solutionString) ? getMatchingEntryCellIndexes(entryString, solutionString).length : 0;
    const droppedCount = isDefined(solutionString) ? entryCount - keptCount : 0;
    const isCompleted = isDefined(solutionString) && isImportedPuzzleCompleted(clueString, entryString, solutionString);
    const getGuidance = (): string | null => {
        const hasEntries = entryCount > 0;
        if (uncertainCellCount > 0) {
            return hasEntries
                ? t({
                      message: plural(uncertainCellCount, {
                          one: '# digit to check. Handwritten digits are kept as your progress. Tap one to make it a printed clue.',
                          other: '# digits to check. Handwritten digits are kept as your progress. Tap one to make it a printed clue.'
                      })
                  })
                : t({ message: plural(uncertainCellCount, { one: '# digit to check', other: '# digits to check' }) });
        }

        return hasEntries ? t`Handwritten digits are kept as your progress. Tap one to make it a printed clue.` : null;
    };
    const keptText =
        keptCount > 0 ? t({ message: plural(keptCount, { one: '# of your entries kept', other: '# of your entries kept' }) }) : null;
    const droppedText = droppedCount > 0 ? t({ message: plural(droppedCount, { one: '# didn’t match', other: '# didn’t match' }) }) : null;
    const guidance = isCompleted
        ? t`Already solved on paper. You'll start from the printed clues.`
        : [droppedText, keptText, getGuidance()].filter(isDefined).join('\n');

    return guidance.length > 0 ? (
        <BlackText accessibilityLiveRegion="polite" style={styles.guidance} testID={ImportScreenSelectors.Guidance}>
            {guidance}
        </BlackText>
    ) : null;
};
