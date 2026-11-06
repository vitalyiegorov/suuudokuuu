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
import { formatSeRatingValue } from '../../../../@generic/utils/format-se-rating-value.util';
import { getDifficultyMessage } from '../../../../@generic/utils/get-difficulty-message.util';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { ImportScreenSelectors } from '../import-screen.selectors';

import { ImportStatusStyles as styles } from './import-status.styles';

import type { MessageDescriptor } from '@lingui/core';
import type { ImportedPuzzleAssessmentType } from '@suuudokuuu/puzzle-forge';

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

const errorForegroundBlend = 0.25;

interface Props {
    readonly sourceStatus: string | null;
    readonly assessed: { readonly assessment: ImportedPuzzleAssessmentType; readonly puzzleString: string } | null;
    readonly isCheckFailed: boolean;
    readonly isRecognizing: boolean;
    readonly puzzleString: string;
}

export const ImportStatus = ({ assessed, isCheckFailed, puzzleString, sourceStatus, isRecognizing }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const getClueCount = (text: string) => Array.from(text).filter(cell => digitPattern.test(cell)).length;
    const getUniqueText = (
        settledAssessment: Extract<ImportedPuzzleAssessmentType, { readonly kind: ImportedPuzzleAssessmentKindEnum.UNIQUE }>
    ): string => {
        const difficulty = t(getDifficultyMessage(settledAssessment.difficulty));
        const rating = formatSeRatingValue(settledAssessment.rating, settledAssessment.isRatingCeiling);

        return t`One solution · ${difficulty} · SE ${rating}`;
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

        return getClueCount(puzzleString) > 0 ? getBoardText() : t`Tap a cell to type it`;
    };

    const statusText = getStatusText();
    const isError =
        (isDefined(sourceStatus) && !isRecognizing) ||
        isCheckFailed ||
        assessed?.assessment.kind === ImportedPuzzleAssessmentKindEnum.CONFLICT ||
        assessed?.assessment.kind === ImportedPuzzleAssessmentKindEnum.NO_SOLUTION;
    const errorColor = interpolateColor(errorForegroundBlend, [0, 1], [theme.colors.danger, theme.colors.text.primary]);
    const color = isError ? errorColor : theme.colors.text.primary;
    const textStyles = [styles.status, { color }];

    return (
        <View
            accessibilityLabel={statusText}
            accessibilityLiveRegion="polite"
            accessible
            style={styles.container}
            testID={ImportScreenSelectors.Status}
        >
            <View style={styles.message}>
                {isError ? (
                    <View style={styles.icon}>
                        <LucideCircleExclamationPoint color={color} size={20} />
                    </View>
                ) : null}
                {isRecognizing ? <ActivityIndicator color={color} size={20} style={styles.icon} /> : null}
                <BlackText style={textStyles}>{statusText}</BlackText>
            </View>
        </View>
    );
};
