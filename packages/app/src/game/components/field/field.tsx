import { use, useCallback, useImperativeHandle, useRef } from 'react';
import { View } from 'react-native';



import { GameContext } from '../../context/game.context';
import { FieldCell, type FieldCellRef } from '../field-cell/field-cell';

import { FieldStyles as styles } from './field.styles';

import type { OnEventFn } from '@rnw-community/shared';
import type { CellInterface, ScoredCellsInterface } from '@suuudokuuu/generator';
import type { Ref } from 'react';
import type { SharedValue } from 'react-native-reanimated';

const getCellKey = (cell: CellInterface) => `${cell.y}-${cell.x}`;

export interface FieldRef {
    triggerCellAnimations: (scoredCells: ScoredCellsInterface) => void;
}

interface Props {
    readonly selectedCell?: CellInterface;
    readonly onSelect: OnEventFn<CellInterface | undefined>;
    readonly ref: Ref<FieldRef>;
    readonly cellAnimation: SharedValue<number>;
    readonly animatedScoredCells?: ScoredCellsInterface;
}

export const Field = ({ selectedCell, onSelect, ref, cellAnimation, animatedScoredCells }: Props) => {
    const { sudoku } = use(GameContext);

    const cellRefs = useRef<Record<string, FieldCellRef | null>>({});

    useImperativeHandle(
        ref,
        () => ({
            triggerCellAnimations: (_scoredCells: ScoredCellsInterface) => {
                /*
                 * This method is kept for backwards compatibility but is no longer used
                 * Animation is now handled at the GameScreen level with a single shared value
                 */
            }
        }),
        []
    );

    const handleCellRef = useCallback((cell: CellInterface) => (cellRef: FieldCellRef | null) => {
        cellRefs.current[getCellKey(cell)] = cellRef;
    }, []);

    return (
        <View style={styles.wrapper}>
            {sudoku.Field.map(row => (
                <View key={`row-${row[0].y}`} style={styles.row}>
                    {row.map(cell => (
                        <FieldCell
                            animatedScoredCells={animatedScoredCells}
                            cell={cell}
                            cellAnimation={cellAnimation}
                            isActive={sudoku.isSameCell(cell, selectedCell)}
                            isActiveValue={sudoku.isSameCellValue(cell, selectedCell)}
                            isHighlighted={sudoku.isCellHighlighted(cell, selectedCell)}
                            isWrong={sudoku.isCellWrong(cell, selectedCell)}
                            key={`cell-${cell.y}-${cell.x}`}
                            onSelect={onSelect}
                            ref={handleCellRef(cell)}
                        />
                    ))}
                </View>
            ))}
        </View>
    );
};
