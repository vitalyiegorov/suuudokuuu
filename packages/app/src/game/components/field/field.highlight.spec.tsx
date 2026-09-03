import { describe, expect, it, jest } from '@jest/globals';
import { FieldEngine } from '@suuudokuuu/field-core';
import { useFieldSnapshot } from '@suuudokuuu/field-core/react';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { act, screen } from '@testing-library/react-native';

import { emptyFn } from '@rnw-community/shared';

import { renderWithGameContext } from '../../../@generic/utils/render-with-game-context.mock';
import { BWLightTheme } from '../../../theme/themes/bw.theme';
import { GameContext } from '../../context/game.context';

import { Field } from './field';

import type { GameContextValueInterface } from '../../interface/game-context-value.interface';

jest.mock('react-native-reanimated', () => {
    const reanimatedMock = jest.requireActual<typeof import('../../../@generic/mocks/react-native-reanimated.mock')>(
        '../../../@generic/mocks/react-native-reanimated.mock'
    );
    const { useRef } = jest.requireActual<typeof import('react')>('react');

    return {
        ...reanimatedMock,
        __esModule: true,
        useAnimatedStyle: (factory: () => object) => {
            const committedStyle = useRef<object | null>(null);

            committedStyle.current ??= factory();

            return committedStyle.current;
        }
    };
});

const puzzleString = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79';

interface Props {
    readonly engine: FieldEngine;
}

const FieldHarness = ({ engine }: Props) => {
    const snapshot = useFieldSnapshot(engine);
    const contextValue: GameContextValueInterface = {
        create: emptyFn,
        createDaily: emptyFn,
        createFromState: emptyFn,
        engine,
        isCreatingGame: false,
        snapshot
    };

    return (
        <GameContext value={contextValue}>
            <Field cellMargin={2} cellSize={40} onSelect={emptyFn} ref={null} />
        </GameContext>
    );
};

const expectCellBackground = (y: number, x: number, backgroundColor: string): void => {
    expect(screen.getByTestId(`CellSelectors.Cell.${y}-${x}`)).toHaveStyle({ backgroundColor });
};

const selectCell = async (engine: FieldEngine, y: number, x: number): Promise<void> =>
    act(() => void engine.selectCell(engine.Sudoku.Field[y][x]));

const clearSelection = async (engine: FieldEngine): Promise<void> => act(() => void engine.selectCell());

const renderBoard = async (engine: FieldEngine) => renderWithGameContext(<FieldHarness engine={engine} />, { engine });

describe('Field selection highlights', () => {
    it('should paint the selected cell, its areas and its twin values', async () => {
        expect.assertions(4);

        const engine = new FieldEngine({ sudokuString: puzzleString, difficulty: DifficultyEnum.Medium });

        await renderBoard(engine);
        await selectCell(engine, 0, 0);

        expectCellBackground(0, 0, BWLightTheme.colors.board.selected);
        expectCellBackground(0, 1, BWLightTheme.colors.surface.subtle);
        expectCellBackground(1, 5, BWLightTheme.colors.board.sameValue);
        expectCellBackground(3, 8, BWLightTheme.colors.board.filled);
    });

    it('should drop the previous highlights when the selection moves to another value', async () => {
        expect.assertions(5);

        const engine = new FieldEngine({ sudokuString: puzzleString, difficulty: DifficultyEnum.Medium });

        await renderBoard(engine);
        await selectCell(engine, 0, 0);
        await selectCell(engine, 3, 8);

        expectCellBackground(3, 8, BWLightTheme.colors.board.selected);
        expectCellBackground(0, 1, BWLightTheme.colors.board.sameValue);
        expectCellBackground(1, 5, BWLightTheme.colors.board.filled);
        expectCellBackground(7, 8, BWLightTheme.colors.surface.subtle);
        expectCellBackground(4, 0, BWLightTheme.colors.board.filled);
    });

    it('should clear every highlight once the selection is dropped', async () => {
        expect.assertions(3);

        const engine = new FieldEngine({ sudokuString: puzzleString, difficulty: DifficultyEnum.Medium });

        await renderBoard(engine);
        await selectCell(engine, 0, 0);
        await clearSelection(engine);

        expectCellBackground(0, 0, BWLightTheme.colors.board.filled);
        expectCellBackground(0, 1, BWLightTheme.colors.board.filled);
        expectCellBackground(1, 5, BWLightTheme.colors.board.filled);
    });
});
