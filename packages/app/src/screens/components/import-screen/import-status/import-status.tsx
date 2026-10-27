import { msg, plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { ImportedPuzzleAssessmentKindEnum } from '@suuudokuuu/puzzle-forge';
import * as AsyncResult from 'effect/reactivity/AsyncResult';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { formatSeRatingValue } from '../../../../@generic/utils/format-se-rating-value.util';
import { getDifficultyMessage } from '../../../../@generic/utils/get-difficulty-message.util';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { ImportScreenSelectors } from '../import-screen.selectors';

import { ImportStatusStyles as styles } from './import-status.styles';

import type { MessageDescriptor } from '@lingui/core';
import type { ImportedPuzzleAssessmentType } from '@suuudokuuu/puzzle-forge';

const invalidAssessmentMessages: Record<
    Exclude<ImportedPuzzleAssessmentKindEnum, ImportedPuzzleAssessmentKindEnum.UNIQUE>,
    MessageDescriptor
> = {
    [ImportedPuzzleAssessmentKindEnum.CONFLICT]: msg`These cells conflict`,
    [ImportedPuzzleAssessmentKindEnum.NO_SOLUTION]: msg`No solution`,
    [ImportedPuzzleAssessmentKindEnum.MULTIPLE_SOLUTIONS]: msg`More than one solution`
};

interface Props {
    readonly assessmentResult: AsyncResult.AsyncResult<ImportedPuzzleAssessmentType, unknown>;
    readonly clueCount: number;
}

export const ImportStatus = ({ assessmentResult, clueCount }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const statusText = AsyncResult.match(assessmentResult, {
        onInitial: () => t`Checking…`,
        onFailure: () => t`This puzzle could not be checked`,
        onSuccess: ({ value: assessment }) => {
            if (assessment.kind !== ImportedPuzzleAssessmentKindEnum.UNIQUE) {
                return t(invalidAssessmentMessages[assessment.kind]);
            }

            const rating = formatSeRatingValue(assessment.rating, assessment.isRatingCeiling);
            const difficulty = t(getDifficultyMessage(assessment.difficulty));

            return t`Exactly one solution · SE ${rating} · ${difficulty}`;
        }
    });
    const clueCountStyles = [styles.clueCount, { color: theme.colors.text.hint }];

    return (
        <View style={styles.container}>
            <BlackText style={clueCountStyles} testID={ImportScreenSelectors.ClueCount}>
                {t({ message: plural(clueCount, { one: '# clue', other: '# clues' }) })}
            </BlackText>
            <BlackText style={styles.status} testID={ImportScreenSelectors.Status}>
                {statusText}
            </BlackText>
        </View>
    );
};
