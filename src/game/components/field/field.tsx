import { View } from 'react-native';

import { type OnEventFn, isDefined } from '@rnw-community/shared';

import { BlankCellValueConstant } from '../../../@logic/constants/blank-cell-value.constant';
import type { CellInterface } from '../../../@logic/interfaces/cell.interface';
import type { FieldInterface } from '../../../@logic/interfaces/field.interface';
import type { ScoredCellsInterface } from '../../../@logic/interfaces/scored-cells.interface';
import { Cell } from '../field-cell/cell';

import { FieldStyles as styles } from './field.styles';

const isCellHighlighted = (cell: CellInterface, selectedCell?: CellInterface): boolean =>
    isDefined(selectedCell) && (selectedCell.x === cell.x || selectedCell.y === cell.y || selectedCell.group === cell.group);

const isSameCell = (cell: CellInterface, selectedCell?: CellInterface): boolean =>
    isDefined(selectedCell) && cell.x === selectedCell.x && cell.y === selectedCell.y;

const isSameCellValue = (cell: CellInterface, selectedCell?: CellInterface): boolean =>
    isDefined(selectedCell) && cell.value === selectedCell.value && cell.value !== BlankCellValueConstant;

interface Props {
    scoredCells?: ScoredCellsInterface;
    field: FieldInterface;
    selectedCell?: CellInterface;
    onSelect: OnEventFn<CellInterface | undefined>;
}

export const Field = ({ field, selectedCell, onSelect, scoredCells }: Props) => (
    <View style={styles.wrapper}>
        {field.map(row => (
            <View key={`row-${row[0].y}`} style={styles.row}>
                {row.map(cell => (
                    <Cell
                        cell={cell}
                        isActive={isSameCell(cell, selectedCell)}
                        isActiveValue={isSameCellValue(cell, selectedCell)}
                        isCellHighlighted={isCellHighlighted(cell, selectedCell)}
                        key={`cell-${cell.y}-${cell.x}`}
                        onSelect={onSelect}
                        scoredCell={scoredCells}
                    />
                ))}
            </View>
        ))}
    </View>
);
