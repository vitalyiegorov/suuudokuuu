import { defaultSudokuConfig } from '@suuudokuuu/generator';
import { Platform } from 'react-native';

export const GameEmptySudokuStringConstant = '.'.repeat(defaultSudokuConfig.fieldSize * defaultSudokuConfig.fieldSize);

export const GameEmptySudokuOptionsConstant = {
    sudokuString: GameEmptySudokuStringConstant,
    ...(Platform.OS === 'web' && {
        solutionString: '123456789456789123789123456234567891567891234891234567345678912678912345912345678'
    })
};
