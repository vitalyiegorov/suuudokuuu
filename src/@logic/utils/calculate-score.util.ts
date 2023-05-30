import {
    BlankCellValueConstant,
    ScoreCorrectMinValueConstant,
    ScoreCorrectValueConstant,
    ScoreElapsedCoefficientConstant,
    ScoreLastInColCoefficientConstant,
    ScoreLastInGroupCoefficientConstant,
    ScoreLastInRowCoefficientConstant,
    ScoreMistakesCoefficientConstant
} from '../../game';
import { type CellInterface } from '../interfaces/cell.interface';
import { type FieldInterface } from '../interfaces/field.interface';

import { hasValueInColumn } from './field/has-value-in-column.util';
import { hasValueInGroup } from './field/has-value-in-group.util';
import { hasValueInRow } from './field/has-value-in-row.util';

// HINT: This is the state after the new value is set on the field
export const calculateScore = (gameField: FieldInterface, selectedCell: CellInterface, mistakes: number, startedAt: Date): number => {
    const elapsedS = (new Date().getTime() - startedAt.getTime()) / 1000;

    const valueDecreasedByMistakes = Math.floor(
        ScoreCorrectValueConstant - ScoreCorrectValueConstant * mistakes * ScoreMistakesCoefficientConstant
    );
    const valueDecreasedByElapsed = Math.floor(
        valueDecreasedByMistakes - valueDecreasedByMistakes * elapsedS * ScoreElapsedCoefficientConstant
    );

    let totalEarned = valueDecreasedByElapsed;
    const blankCell = { ...selectedCell, value: BlankCellValueConstant };
    if (!hasValueInRow(blankCell, gameField)) {
        totalEarned += valueDecreasedByElapsed * ScoreLastInRowCoefficientConstant;
    }

    if (!hasValueInGroup(blankCell, gameField)) {
        totalEarned += valueDecreasedByElapsed * ScoreLastInGroupCoefficientConstant;
    }

    if (!hasValueInColumn(blankCell, gameField)) {
        totalEarned += valueDecreasedByElapsed * ScoreLastInColCoefficientConstant;
    }

    return Math.max(totalEarned, ScoreCorrectMinValueConstant);
};
