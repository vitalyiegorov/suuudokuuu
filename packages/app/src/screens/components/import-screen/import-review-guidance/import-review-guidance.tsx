import { plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { getMatchingEntryCellIndexes, isImportedPuzzleCompleted } from '@suuudokuuu/puzzle-forge';
import { use } from 'react';

import { isDefined } from '@rnw-community/shared';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { ImportScreenSelectors } from '../import-screen.selectors';

import { ImportReviewGuidanceStyles as styles } from './import-review-guidance.styles';

import type { ImportReviewStateInterface } from '../interface/import-review-state.interface';
import type { SerializedPuzzleInterface } from '@suuudokuuu/puzzle-forge';

interface Props {
    readonly clueString: string;
    readonly review: Pick<ImportReviewStateInterface, 'entryString' | 'uncertainCellIndexes'>;
    readonly assessment: Pick<SerializedPuzzleInterface, 'solutionString'> | null;
}

export const ImportReviewGuidance = ({ clueString, review, assessment }: Props) => {
    const { entryString } = review;
    const uncertainCellCount = review.uncertainCellIndexes.length;
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const solutionString = assessment?.solutionString ?? null;
    const entryCount = Array.from(entryString).filter(digit => /[1-9]/u.test(digit)).length;
    const keptCount = isDefined(solutionString) ? getMatchingEntryCellIndexes(entryString, solutionString).length : 0;
    const droppedCount = isDefined(solutionString) ? entryCount - keptCount : 0;
    const isCompleted = isDefined(solutionString) && isImportedPuzzleCompleted(clueString, entryString, solutionString);
    const uncertainText =
        uncertainCellCount > 0 ? t({ message: plural(uncertainCellCount, { one: '# digit to check', other: '# digits to check' }) }) : null;
    const keptText =
        keptCount > 0 ? t({ message: plural(keptCount, { one: '# of your entries kept', other: '# of your entries kept' }) }) : null;
    const droppedText = droppedCount > 0 ? t({ message: plural(droppedCount, { one: '# didn’t match', other: '# didn’t match' }) }) : null;
    const guidance = isCompleted
        ? t`Already solved on paper. You'll start from the printed clues.`
        : [uncertainText, keptText, droppedText].filter(isDefined).join(' · ');
    const guidanceStyles = [styles.guidance, { color: theme.colors.text.hint }];

    return guidance.length > 0 ? (
        <BlackText accessibilityLiveRegion="polite" style={guidanceStyles} testID={ImportScreenSelectors.Guidance}>
            {guidance}
        </BlackText>
    ) : null;
};
