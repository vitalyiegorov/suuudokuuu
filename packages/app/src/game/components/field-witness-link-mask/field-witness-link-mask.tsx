import { useId } from 'react';
import { Defs, G, Mask, Rect } from 'react-native-svg';

import { gameGetWitnessPoint } from '../../utils/game-get-witness-point.util';

import type { CellInterface } from '@suuudokuuu/generator';
import type { ReactNode } from 'react';

const valueWidthRatio = 0.7;
const valueHeightRatio = 0.85;

interface Props {
    readonly boardSize: number;
    readonly cellMargin: number;
    readonly cellSize: number;
    readonly filledCells: readonly CellInterface[];
    readonly children: ReactNode;
}

export const FieldWitnessLinkMask = ({ boardSize, cellMargin, cellSize, filledCells, children }: Props) => {
    const maskId = useId().replaceAll(':', '');
    const valueWidth = cellSize * valueWidthRatio;
    const valueHeight = cellSize * valueHeightRatio;

    return (
        <>
            <Defs>
                <Mask
                    height={boardSize}
                    id={maskId}
                    maskContentUnits="userSpaceOnUse"
                    maskUnits="userSpaceOnUse"
                    width={boardSize}
                    x={0}
                    y={0}
                >
                    <Rect fill="white" height={boardSize} width={boardSize} x={0} y={0} />
                    {filledCells.map(cell => {
                        const center = gameGetWitnessPoint(cell, 5, cellSize, cellMargin);
                        const originX = center.x - valueWidth / 2;
                        const originY = center.y - valueHeight / 2;

                        return (
                            <Rect
                                fill="black"
                                height={valueHeight}
                                key={`${cell.y}-${cell.x}`}
                                width={valueWidth}
                                x={originX}
                                y={originY}
                            />
                        );
                    })}
                </Mask>
            </Defs>
            <G mask={`url(#${maskId})`}>{children}</G>
        </>
    );
};
