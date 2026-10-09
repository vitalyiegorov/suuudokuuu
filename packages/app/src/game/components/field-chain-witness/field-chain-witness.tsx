import { ChainLinkEnum } from '@suuudokuuu/techniques';
import { use } from 'react';
import { Line } from 'react-native-svg';

import { ThemeContext } from '../../../theme/context/theme.context';
import { gameGetWitnessPoint } from '../../utils/game-get-witness-point.util';
import { FieldWitnessCandidate } from '../field-witness-candidate/field-witness-candidate';
import { FieldWitnessLinkMask } from '../field-witness-link-mask/field-witness-link-mask';

import type { CellInterface } from '@suuudokuuu/generator';
import type { ChainCandidateInterface } from '@suuudokuuu/techniques';

const lineWidthRatio = 0.045;
const lineMinimumWidth = 1.5;
const weakDashGapRatio = 1.5;

interface Props {
    readonly boardSize: number;
    readonly cellMargin: number;
    readonly cellSize: number;
    readonly chain: readonly ChainCandidateInterface[];
    readonly filledCells: readonly CellInterface[];
}

export const FieldChainWitness = ({ boardSize, cellMargin, cellSize, chain, filledCells }: Props) => {
    const { theme } = use(ThemeContext);
    const lineWidth = Math.max(lineMinimumWidth, cellSize * lineWidthRatio);
    const weakDash = `${lineWidth * 2},${lineWidth * weakDashGapRatio}`;

    return (
        <>
            <FieldWitnessLinkMask boardSize={boardSize} cellMargin={cellMargin} cellSize={cellSize} filledCells={filledCells}>
                {chain.slice(1).map((candidate, index) => {
                    const previous = gameGetWitnessPoint(chain[index].cell, chain[index].value, cellSize, cellMargin);
                    const current = gameGetWitnessPoint(candidate.cell, candidate.value, cellSize, cellMargin);
                    const isStrong = candidate.link === ChainLinkEnum.STRONG;
                    const stroke = isStrong ? theme.colors.accent : theme.colors.text.hint;
                    const strokeDasharray = isStrong ? '' : weakDash;

                    return (
                        <Line
                            key={`link-${index}`}
                            stroke={stroke}
                            strokeDasharray={strokeDasharray}
                            strokeWidth={lineWidth}
                            x1={previous.x}
                            x2={current.x}
                            y1={previous.y}
                            y2={current.y}
                        />
                    );
                })}
            </FieldWitnessLinkMask>
            {chain.map((candidate, index) => (
                <FieldWitnessCandidate candidate={candidate} cellMargin={cellMargin} cellSize={cellSize} key={`candidate-${index}`} />
            ))}
        </>
    );
};
