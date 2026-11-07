import { defaultSudokuConfig } from '@suuudokuuu/generator';

export const GameEmptySudokuStringConstant = '.'.repeat(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize);

export const GameEmptySudokuOptionsConstant = {
    sudokuString: GameEmptySudokuStringConstant,
    solutionString: '123456789456789123789123456234567891567891234891234567345678912678912345912345678'
};
