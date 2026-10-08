'use client';

import { useId } from 'react';

import type { FieldCellType } from '../../types/field-cell.type';
import type { ReactNode } from 'react';

const cellUnitSize = 3;
const valueOriginX = 0.45;
const valueOriginY = 0.225;

interface Props {
    filledCells: readonly FieldCellType[];
    children: ReactNode;
}

export const FieldWitnessLinkMask = ({ children, filledCells }: Props) => {
    const maskId = useId().replaceAll(':', '');

    return (
        <>
            <defs>
                <mask height="27" id={maskId} maskContentUnits="userSpaceOnUse" maskUnits="userSpaceOnUse" width="27" x="0" y="0">
                    <rect fill="white" height="27" width="27" x="0" y="0" />
                    {filledCells.map(cell => {
                        const originX = cell.x * cellUnitSize + valueOriginX;
                        const originY = cell.y * cellUnitSize + valueOriginY;

                        return <rect fill="black" height="2.55" key={`${cell.y}-${cell.x}`} width="2.1" x={originX} y={originY} />;
                    })}
                </mask>
            </defs>
            <g mask={`url(#${maskId})`}>{children}</g>
        </>
    );
};
