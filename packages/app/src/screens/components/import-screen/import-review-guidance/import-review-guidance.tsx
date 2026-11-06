import { plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';

import { isDefined } from '@rnw-community/shared';

import { BlackText } from '../../../../@generic/components/black-text/black-text';

import { ImportReviewGuidanceStyles as styles } from './import-review-guidance.styles';

interface Props {
    readonly entryCount: number;
    readonly uncertainCellCount: number;
}

export const ImportReviewGuidance = ({ entryCount, uncertainCellCount }: Props) => {
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
    const guidance = getGuidance();

    return isDefined(guidance) ? <BlackText style={styles.guidance}>{guidance}</BlackText> : null;
};
