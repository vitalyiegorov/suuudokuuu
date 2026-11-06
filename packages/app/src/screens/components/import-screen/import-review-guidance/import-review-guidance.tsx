import { plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';

import { isDefined } from '@rnw-community/shared';

import { BlackText } from '../../../../@generic/components/black-text/black-text';

import { ImportReviewGuidanceStyles as styles } from './import-review-guidance.styles';

interface Props {
    readonly keptEntryCount: number;
    readonly entryCount: number;
    readonly uncertainCellCount: number;
}

export const ImportReviewGuidance = ({ entryCount, uncertainCellCount, keptEntryCount: keptCount }: Props) => {
    const { t } = useLingui();
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
    const guidance = [keptText, getGuidance()].filter(isDefined).join(' · ');

    return guidance.length > 0 ? <BlackText style={styles.guidance}>{guidance}</BlackText> : null;
};
