import { msg, plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { defaultSudokuConfig } from '@suuudokuuu/generator';
import { getMatchingEntryCellIndexes, ImportedPuzzleAssessmentKindEnum } from '@suuudokuuu/puzzle-forge';
import { use } from 'react';
import { View } from 'react-native';
import Animated, { Easing, FadeIn, FadeOut } from 'react-native-reanimated';

import { isDefined } from '@rnw-community/shared';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { animationDurationConstant, animationEaseOutCurveConstant } from '../../../../@generic/constants/animation.constant';
import { formatSeRatingValue } from '../../../../@generic/utils/format-se-rating-value.util';
import { getDifficultyMessage } from '../../../../@generic/utils/get-difficulty-message.util';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { ImportScreenSelectors } from '../import-screen.selectors';

import { ImportStatusStyles as styles } from './import-status.styles';

import type { MessageDescriptor } from '@lingui/core';
import type { ImportedPuzzleAssessmentType } from '@suuudokuuu/puzzle-forge';

const { fieldGroupHeight, fieldGroupWidth, fieldSize } = defaultSudokuConfig;
const crossfadeEasing = Easing.bezier(...animationEaseOutCurveConstant);
const statusEntering = FadeIn.duration(animationDurationConstant).easing(crossfadeEasing);
const statusExiting = FadeOut.duration(animationDurationConstant).easing(crossfadeEasing);
const digitPattern = /[1-9]/u;

const conflictUnits = [
    {
        getUnit: (cellIndex: number) => Math.floor(cellIndex / fieldSize),
        describe: (digit: string, count: number, row: number) =>
            msg({ message: plural(count, { 2: `Two ${digit}s in row ${row}`, other: `# ${digit}s in row ${row}` }) })
    },
    {
        getUnit: (cellIndex: number) => cellIndex % fieldSize,
        describe: (digit: string, count: number, column: number) =>
            msg({ message: plural(count, { 2: `Two ${digit}s in column ${column}`, other: `# ${digit}s in column ${column}` }) })
    },
    {
        getUnit: (cellIndex: number) =>
            Math.floor(cellIndex / fieldSize / fieldGroupHeight) * fieldGroupHeight + Math.floor((cellIndex % fieldSize) / fieldGroupWidth),
        describe: (digit: string, count: number, box: number) =>
            msg({ message: plural(count, { 2: `Two ${digit}s in box ${box}`, other: `# ${digit}s in box ${box}` }) })
    }
];

const getConflictMessage = (puzzleString: string, cellIndexes: readonly number[]): MessageDescriptor => {
    const conflict = conflictUnits
        .flatMap(unit => cellIndexes.map(cellIndex => ({ cellIndex, unit })))
        .map(({ cellIndex, unit }) => ({
            cellIndex,
            count: cellIndexes.filter(
                otherIndex => puzzleString[otherIndex] === puzzleString[cellIndex] && unit.getUnit(otherIndex) === unit.getUnit(cellIndex)
            ).length,
            unit
        }))
        .find(({ count }) => count > 1);

    return isDefined(conflict)
        ? conflict.unit.describe(puzzleString[conflict.cellIndex], conflict.count, conflict.unit.getUnit(conflict.cellIndex) + 1)
        : msg`These cells conflict`;
};

interface Props {
    readonly entryString: string;
    readonly sourceStatus: string | null;
    readonly assessed: { readonly assessment: ImportedPuzzleAssessmentType; readonly puzzleString: string } | null;
    readonly isCheckFailed: boolean;
    readonly puzzleString: string;
}

export const ImportStatus = ({ assessed, isCheckFailed, puzzleString, entryString, sourceStatus }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const getClueCount = (text: string) => Array.from(text).filter(cell => digitPattern.test(cell)).length;
    const boardClueCount = getClueCount(puzzleString);
    const getUniqueText = (
        settledAssessment: Extract<ImportedPuzzleAssessmentType, { readonly kind: ImportedPuzzleAssessmentKindEnum.UNIQUE }>
    ): string => {
        const difficulty = t(getDifficultyMessage(settledAssessment.difficulty));
        const rating = formatSeRatingValue(settledAssessment.rating, settledAssessment.isRatingCeiling);

        const entryCount = getClueCount(entryString);
        const keptCount = getMatchingEntryCellIndexes(entryString, settledAssessment.solutionString).length;
        const droppedCount = entryCount - keptCount;
        const keptText = t({ message: plural(keptCount, { one: '# of your entries kept', other: '# of your entries kept' }) });
        const droppedText = t({ message: plural(droppedCount, { one: '# didn’t match', other: '# didn’t match' }) });
        const assessmentText = t`One solution · ${difficulty} · SE ${rating}`;

        return entryCount > 0 ? `${assessmentText} · ${keptText} · ${droppedText}` : assessmentText;
    };
    const getAssessmentText = ({
        assessment: settledAssessment,
        puzzleString: assessedPuzzleString
    }: NonNullable<Props['assessed']>): string => {
        if (settledAssessment.kind === ImportedPuzzleAssessmentKindEnum.CONFLICT) {
            return t(getConflictMessage(assessedPuzzleString, settledAssessment.cellIndexes));
        }

        if (settledAssessment.kind === ImportedPuzzleAssessmentKindEnum.UNIQUE) {
            return getUniqueText(settledAssessment);
        }

        if (settledAssessment.kind === ImportedPuzzleAssessmentKindEnum.COMPLETE) {
            return t`This puzzle is already complete`;
        }

        const clueCount = getClueCount(assessedPuzzleString);

        return settledAssessment.kind === ImportedPuzzleAssessmentKindEnum.NO_SOLUTION
            ? t`No solution`
            : t({ message: plural(clueCount, { one: '# clue · more than one solution', other: '# clues · more than one solution' }) });
    };
    const getBoardText = (): string => {
        if (isCheckFailed) {
            return t`This puzzle could not be checked`;
        }

        return isDefined(assessed) ? getAssessmentText(assessed) : t`Checking…`;
    };
    const getStatusText = (): string => {
        if (isDefined(sourceStatus)) {
            return sourceStatus;
        }

        return boardClueCount > 0 ? getBoardText() : t`Tap a cell to type it`;
    };

    const statusText = getStatusText();
    const isHint = boardClueCount === 0 || isDefined(sourceStatus);
    const textStyles = [styles.status, { color: isHint ? theme.colors.text.hint : theme.colors.text.primary }];

    return (
        <View
            accessibilityLabel={statusText}
            accessibilityLiveRegion="polite"
            accessible
            style={styles.container}
            testID={ImportScreenSelectors.Status}
        >
            <Animated.View entering={statusEntering} exiting={statusExiting} key={statusText}>
                <BlackText style={textStyles}>{statusText}</BlackText>
            </Animated.View>
        </View>
    );
};
