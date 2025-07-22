import { use, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { View } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';

import { animationDurationConstant } from '../../../@generic/constants/animation.constant';
import { GameContext } from '../../context/game.context';
import { FieldCell, type FieldCellRef } from '../field-cell/field-cell';

import { FieldStyles as styles } from './field.styles';

import type { OnEventFn } from '@rnw-community/shared';
import type { CellInterface, ScoredCellsInterface } from '@suuudokuuu/generator';
import type { Ref } from 'react';

const getCellKey = (cell: CellInterface) => `${cell.y}-${cell.x}`;

export interface FieldRef {
    triggerCellAnimations: (scoredCells: ScoredCellsInterface) => void;
}

interface Props {
    readonly selectedCell?: CellInterface;
    readonly onSelect: OnEventFn<CellInterface | undefined>;
    readonly ref: Ref<FieldRef>;
}

export const Field = ({ selectedCell, onSelect, ref }: Props) => {
    const { sudoku } = use(GameContext);

    const cellRefs = useRef<Record<string, FieldCellRef | null>>({});
    const [animatedScoredCells, setAnimatedScoredCells] = useState<ScoredCellsInterface>();
    
    // Single shared animation value for all cells
    const cellAnimation = useSharedValue(0);

    useImperativeHandle(
        ref,
        () => ({
            triggerCellAnimations: (scoredCells: ScoredCellsInterface) => {
                // Set the scored cells that should animate
                setAnimatedScoredCells(scoredCells);
                
                // Trigger single animation for all cells
                cellAnimation.value = withTiming(1, { duration: 2 * animationDurationConstant }, finished => {
                    if (finished === true) {
                        cellAnimation.value = 0;
                        setAnimatedScoredCells(undefined);
                    }
                });
            }
        }),
        [cellAnimation]
    );

    const handleCellRef = useCallback((cell: CellInterface) => (cellRef: FieldCellRef | null) => {
        cellRefs.current[getCellKey(cell)] = cellRef;
    }, []);

    return (
        <View style={styles.wrapper}>
            {sudoku.Field.map(row => (
                <View key={`row-${row[0].y}`} style={styles.row}>
                    {row.map(cell => {
                        // Check if this cell should animate based on scored cells
                        const shouldAnimate = Boolean(animatedScoredCells && sudoku.isScoredCell(cell, animatedScoredCells));
                        
                        return (
                            <FieldCell
                                animatedScoredCells={shouldAnimate ? animatedScoredCells : undefined}
                                cell={cell}
                                cellAnimation={shouldAnimate ? cellAnimation : undefined}
                                isActive={sudoku.isSameCell(cell, selectedCell)}
                                isActiveValue={sudoku.isSameCellValue(cell, selectedCell)}
                                isHighlighted={sudoku.isCellHighlighted(cell, selectedCell)}
                                isWrong={sudoku.isCellWrong(cell, selectedCell)}
                                key={`cell-${cell.y}-${cell.x}`}
                                onSelect={onSelect}
                                ref={handleCellRef(cell)}
                            />
                        );
                    })}
                </View>
            ))}
        </View>
    );
};
