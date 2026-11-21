import { plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { getMatchingEntryCellIndexes, isImportedPuzzleCompleted } from '@suuudokuuu/puzzle-forge';

import { isDefined, isNotEmptyString } from '@rnw-community/shared';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { ImportScreenSelectors } from '../import-screen.selectors';

import { ImportReviewGuidanceStyles as styles } from './import-review-guidance.styles';

import type { SerializedPuzzleInterface } from '@suuudokuuu/puzzle-forge';

interface Props {
    readonly clueString: string;
    readonly entryString: string;
    readonly lead: string | null;
    readonly assessment: Pick<SerializedPuzzleInterface, 'solutionString'> | null;
}

export const ImportReviewGuidance = ({ clueString, entryString, lead, assessment }: Props) => {
    const { t } = useLingui();
    const solutionString = assessment?.solutionString ?? null;
    const entryCount = Array.from(entryString).filter(digit => /[1-9]/u.test(digit)).length;
    const keptCount = isDefined(solutionString) ? getMatchingEntryCellIndexes(entryString, solutionString).length : 0;
    const droppedCount = isDefined(solutionString) ? entryCount - keptCount : 0;
    const isCompleted = isDefined(solutionString) && isImportedPuzzleCompleted(clueString, entryString, solutionString);
    const keptText =
        keptCount > 0 ? t({ message: plural(keptCount, { one: 'Play keeps your # digit', other: 'Play keeps your # digits' }) }) : null;
    const droppedText =
        droppedCount > 0
            ? t({ message: plural(droppedCount, { one: 'Play clears # wrong digit in red', other: 'Play clears # wrong digits in red' }) })
            : null;
    const entriesText = isCompleted ? t`Play starts from the printed clues` : (droppedText ?? keptText);
    const guidance = [lead, entriesText].filter(isNotEmptyString).join(' · ');

    return guidance.length > 0 ? (
        <BlackText
            accessibilityLiveRegion="polite"
            adjustsFontSizeToFit
            minimumFontScale={0.85}
            numberOfLines={2}
            style={styles.guidance}
            testID={ImportScreenSelectors.Guidance}
        >
            {guidance}
        </BlackText>
    ) : null;
};
