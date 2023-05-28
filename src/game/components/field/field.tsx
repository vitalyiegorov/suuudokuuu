import { isDefined, type OnEventFn } from '@rnw-community/shared';
import { View } from 'react-native';

import { BlankCellValueConstant } from '../../constants/blank-cell-value.constant';
import { type CellInterface } from '../../interfaces/cell.interface';
import { type FieldInterface } from '../../interfaces/field.interface';
import { Cell } from '../field-cell/cell';

import { FieldStyles as styles } from './field.styles';

const isCellHighlighted = (cell: CellInterface, selectedCell?: CellInterface): boolean =>
    isDefined(selectedCell) && (selectedCell.x === cell.x || selectedCell.y === cell.y || selectedCell.group === cell.group);

const isSameCell = (cell: CellInterface, selectedCell?: CellInterface): boolean =>
    isDefined(selectedCell) && cell.x === selectedCell.x && cell.y === selectedCell.y;

const isSameCellValue = (cell: CellInterface, selectedCell?: CellInterface): boolean =>
    isDefined(selectedCell) && cell.value === selectedCell?.value && cell.value !== BlankCellValueConstant;

const isScoredCell = (cell: CellInterface, scoredCells?: CellInterface): boolean =>
    isDefined(scoredCells) && (scoredCells.x === cell.x || scoredCells.y === cell.y || scoredCells.group === cell.group);

interface Props {
    scoredCells?: CellInterface;
    field: FieldInterface;
    selectedCell?: CellInterface;
    onSelect: OnEventFn<CellInterface | undefined>;
}

export const Field = ({ field, selectedCell, onSelect, scoredCells }: Props) => {
    return (
        <View style={styles.wrapper}>
            {field.map(row => (
                <View key={`row-${row[0].y}`} style={styles.row}>
                    {row.map(cell => (
                        <Cell
                            isScored={isScoredCell(cell, scoredCells)}
                            key={`cell-${cell.y}-${cell.x}`}
                            cell={cell}
                            onSelect={onSelect}
                            isActive={isSameCell(cell, selectedCell)}
                            isActiveValue={isSameCellValue(cell, selectedCell)}
                            isCellHighlighted={isCellHighlighted(cell, selectedCell)}
                        />
                    ))}
                </View>
            ))}
        </View>
    );
};
