import {
    ScoreCorrectValueConstant,
    ScoreElapsedCoefficientConstant,
    ScoreLastInColCoefficientConstant,
    ScoreLastInGroupCoefficientConstant,
    ScoreLastInRowCoefficientConstant,
    ScoreMistakesCoefficientConstant
} from '../../constants/score.constant';
import { type CellInterface } from '../../interfaces/cell.interface';
import { type FieldInterface } from '../../interfaces/field.interface';
import { isLastInCol } from '../cell/is-last-in-col.util';
import { isLastInGroup } from '../cell/is-last-in-group.util';
import { isLastInRow } from '../cell/is-last-in-row.util';

export const calculateScore = (gameField: FieldInterface, selectedCell: CellInterface, mistakes: number, startedAt: Date): number => {
    const elapsedS = (new Date().getTime() - startedAt.getTime()) / 1000;

    const valueDecreasedByMistakes = Math.floor(
        ScoreCorrectValueConstant - ScoreCorrectValueConstant * mistakes * ScoreMistakesCoefficientConstant
    );
    const valueDecreasedByElapsed = Math.floor(
        valueDecreasedByMistakes - valueDecreasedByMistakes * elapsedS * ScoreElapsedCoefficientConstant
    );

    let totalEarned = valueDecreasedByElapsed;
    if (isLastInRow(gameField, selectedCell)) {
        totalEarned += valueDecreasedByElapsed * ScoreLastInRowCoefficientConstant;
    }

    if (isLastInGroup(gameField, selectedCell)) {
        totalEarned += valueDecreasedByElapsed * ScoreLastInGroupCoefficientConstant;
    }

    if (isLastInCol(gameField, selectedCell)) {
        totalEarned += valueDecreasedByElapsed * ScoreLastInColCoefficientConstant;
    }

    return totalEarned;
};
