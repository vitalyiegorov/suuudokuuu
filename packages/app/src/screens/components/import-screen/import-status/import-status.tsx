import { msg, plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { defaultSudokuConfig } from '@suuudokuuu/generator';
import { ImportedPuzzleAssessmentKindEnum } from '@suuudokuuu/puzzle-forge';
import LucideCircleExclamationPoint from 'lucide-react-native/icons/circle-exclamation-point';
import { use } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { interpolateColor } from 'react-native-reanimated';

import { isDefined } from '@rnw-community/shared';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { getDifficultyMessage } from '../../../../@generic/utils/get-difficulty-message.util';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { ImportReviewGuidance } from '../import-review-guidance/import-review-guidance';
import { ImportScreenSelectors } from '../import-screen.selectors';

import { ImportStatusStyles as styles } from './import-status.styles';

import type { ImportReviewStateInterface } from '../interface/import-review-state.interface';
import type { MessageDescriptor } from '@lingui/core';
import type { ImportedPuzzleAssessmentType, SerializedPuzzleInterface } from '@suuudokuuu/puzzle-forge';

const { fieldGroupHeight, fieldGroupWidth, fieldSize } = defaultSudokuConfig;
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

const getSourceMessage = ({ isGridMissed, isPasteMissed, isRecognizing }: Props['review']): MessageDescriptor | null => {
    if (isRecognizing) {
        return msg`Reading the puzzle…`;
    }
    if (isGridMissed) {
        return msg`Couldn't find a sudoku grid`;
    }

    return isPasteMissed ? msg`No puzzle found on the clipboard` : null;
};

const getSourceDetailMessage = ({ isGridMissed, isPasteMissed, isRecognizing }: Props['review']): MessageDescriptor | null => {
    if (isGridMissed && !isRecognizing) {
        return msg`Try a closer, straighter photo`;
    }

    return isPasteMissed ? msg`Copy a puzzle link or 81 digits, then paste again` : null;
};

const getClueCount = (text: string) => Array.from(text).filter(cell => digitPattern.test(cell)).length;

const isEditHintVisible = (review: Props['review'], puzzleString: string, assessmentKind?: ImportedPuzzleAssessmentKindEnum | null) =>
    (assessmentKind === ImportedPuzzleAssessmentKindEnum.UNIQUE || getClueCount(puzzleString) === 0) &&
    !isDefined(getSourceMessage(review)) &&
    !isDefined(review.selectedCellIndex) &&
    !digitPattern.test(review.entryString);

const errorForegroundBlend = 0.25;

interface Props {
    readonly assessed: { readonly assessment: ImportedPuzzleAssessmentType; readonly puzzleString: string } | null;
    readonly uniqueAssessment: Pick<SerializedPuzzleInterface, 'solutionString'> | null;
    readonly isCheckFailed: boolean;
    readonly review: Pick<
        ImportReviewStateInterface,
        'entryString' | 'isGridMissed' | 'isPasteMissed' | 'isRecognizing' | 'selectedCellIndex' | 'uncertainCellIndexes'
    >;
    readonly puzzleString: string;
}

export const ImportStatus = ({ assessed, uniqueAssessment, isCheckFailed, puzzleString, review }: Props) => {
    const { entryString, isRecognizing } = review;
    const uncertainCellCount = review.uncertainCellIndexes.length;
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const getAssessmentText = ({
        assessment: settledAssessment,
        puzzleString: assessedPuzzleString
    }: NonNullable<Props['assessed']>): string => {
        if (settledAssessment.kind === ImportedPuzzleAssessmentKindEnum.CONFLICT) {
            return t(getConflictMessage(assessedPuzzleString, settledAssessment.cellIndexes));
        }
        if (settledAssessment.kind === ImportedPuzzleAssessmentKindEnum.UNIQUE) {
            const difficulty = t(getDifficultyMessage(settledAssessment.difficulty));

            return t`Ready to play · ${difficulty}`;
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
        if (getClueCount(puzzleString) === 0) {
            return t`Enter the printed clues`;
        }
        if (isCheckFailed) {
            return t`This puzzle could not be checked`;
        }

        return isDefined(assessed) ? getAssessmentText(assessed) : t`Checking…`;
    };

    const sourceMessage = getSourceMessage(review);
    const sourceDetailMessage = getSourceDetailMessage(review);
    const sourceText = isDefined(sourceMessage) ? t(sourceMessage) : null;
    const boardText = getBoardText();
    const assessmentKind = isCheckFailed ? null : assessed?.assessment.kind;
    const uncertainText =
        uncertainCellCount > 0
            ? t({ message: plural(uncertainCellCount, { one: 'Check the dotted digit', other: 'Check the # dotted digits' }) })
            : null;
    const isReviewLeading = !isDefined(sourceText) && assessmentKind === ImportedPuzzleAssessmentKindEnum.UNIQUE;
    const reviewText = isReviewLeading ? uncertainText : null;
    const statusText = sourceText ?? reviewText ?? boardText;
    const sourceDetail = isDefined(sourceDetailMessage) ? t(sourceDetailMessage) : null;
    const sourceAssessment = isDefined(sourceText) ? null : uniqueAssessment;
    const editDetail = isEditHintVisible(review, puzzleString, assessmentKind) ? t`Tap a cell to edit` : null;
    const detailLead = sourceDetail ?? (isDefined(reviewText) ? null : uncertainText) ?? editDetail;
    const isError =
        (isDefined(sourceText) && !isRecognizing) ||
        isCheckFailed ||
        assessmentKind === ImportedPuzzleAssessmentKindEnum.CONFLICT ||
        assessmentKind === ImportedPuzzleAssessmentKindEnum.NO_SOLUTION;
    const errorColor = interpolateColor(errorForegroundBlend, [0, 1], [theme.colors.danger, theme.colors.text.primary]);
    const color = isError ? errorColor : theme.colors.text.primary;
    const textStyles = [styles.status, { color }];

    return (
        <>
            <View
                accessibilityLabel={statusText}
                accessibilityLiveRegion="polite"
                accessible
                style={styles.container}
                testID={ImportScreenSelectors.Status}
            >
                {isError ? (
                    <View style={styles.icon}>
                        <LucideCircleExclamationPoint color={color} size={20} />
                    </View>
                ) : null}
                {isRecognizing ? <ActivityIndicator color={color} size={20} style={styles.icon} /> : null}
                <BlackText numberOfLines={2} style={textStyles}>
                    {statusText}
                </BlackText>
            </View>
            <ImportReviewGuidance assessment={sourceAssessment} clueString={puzzleString} entryString={entryString} lead={detailLead} />
        </>
    );
};
