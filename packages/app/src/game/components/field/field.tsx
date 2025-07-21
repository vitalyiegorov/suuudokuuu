import { isEmptyScoredCells } from '@suuudokuuu/generator';
import { useImperativeHandle, useRef } from 'react';
import { View } from 'react-native';

import { FieldCell, type FieldCellRef } from '../field-cell/field-cell';

import { FieldStyles as styles } from './field.styles';

import type { OnEventFn } from '@rnw-community/shared';
import type { CellInterface, FieldInterface, ScoredCellsInterface, Sudoku } from '@suuudokuuu/generator';
import type { Ref } from 'react';

const getCellKey = (cell: CellInterface) => `${cell.y}-${cell.x}`;

export interface FieldRef {
    triggerCellAnimations: (scoredCells: ScoredCellsInterface) => void;
}

interface Props {
    readonly sudoku: Sudoku;
    readonly field: FieldInterface;
    readonly selectedCell?: CellInterface;
    readonly onSelect: OnEventFn<CellInterface | undefined>;
    readonly ref: Ref<FieldRef>;
}

export const Field = ({ field, selectedCell, onSelect, sudoku, ref }: Props) => {
    const cellRefs = useRef<Record<string, FieldCellRef | null>>({});

    useImperativeHandle(
        ref,
        () => ({
            triggerCellAnimations: (scoredCells: ScoredCellsInterface) => {
                if (!isEmptyScoredCells(scoredCells)) {
                    field.forEach(row => {
                        row.forEach(cell => {
                            if (sudoku.isScoredCell(cell, scoredCells)) {
                                cellRefs.current[getCellKey(cell)]?.triggerAnimation();
                            }
                        });
                    });
                }
            }
        }),
        [field, sudoku]
    );

    const handleCellRef = (cell: CellInterface) => (cellRef: FieldCellRef | null) => {
        cellRefs.current[getCellKey(cell)] = cellRef;
    };

    return (
        <View style={styles.wrapper}>
            {field.map(row => (
                <View key={`row-${row[0].y}`} style={styles.row}>
                    {row.map(cell => (
                        <FieldCell
                            cell={cell}
                            isActive={sudoku.isSameCell(cell, selectedCell)}
                            isActiveValue={sudoku.isSameCellValue(cell, selectedCell)}
                            isHighlighted={sudoku.isCellHighlighted(cell, selectedCell)}
                            isWrong={sudoku.isCellWrong(cell, selectedCell)}
                            key={`cell-${cell.y}-${cell.x}`}
                            onSelect={onSelect}
                            ref={handleCellRef(cell)}
                            sudoku={sudoku}
                        />
                    ))}
                </View>
            ))}
        </View>
    );
};
