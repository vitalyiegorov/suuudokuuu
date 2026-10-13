import { ChainLinkEnum } from '@suuudokuuu/techniques';
import { use } from 'react';
import { Line } from 'react-native-svg';

import { ThemeContext } from '../../../theme/context/theme.context';
import { gameGetWitnessBadgeColors } from '../../utils/game-get-witness-badge-colors.util';
import { gameGetWitnessPoint } from '../../utils/game-get-witness-point.util';
import { FieldWitnessCandidate } from '../field-witness-candidate/field-witness-candidate';
import { FieldWitnessLinkMask } from '../field-witness-link-mask/field-witness-link-mask';

import type { CellInterface } from '@suuudokuuu/generator';
import type { ChainCandidateInterface } from '@suuudokuuu/techniques';

const lineWidthRatio = 0.045;
const lineMinimumWidth = 1.5;
const weakDashGapRatio = 1.5;
const earlierLinkOpacity = 0.5;
const newestLinkWidthRatio = 1.6;

interface Props {
    readonly boardSize: number;
    readonly cellMargin: number;
    readonly cellSize: number;
    readonly chain: readonly ChainCandidateInterface[];
    readonly filledCells: readonly CellInterface[];
}

export const FieldChainWitness = ({ boardSize, cellMargin, cellSize, chain, filledCells }: Props) => {
    const { theme } = use(ThemeContext);
    const badgeColors = gameGetWitnessBadgeColors(theme);
    const lineWidth = Math.max(lineMinimumWidth, cellSize * lineWidthRatio);
    const weakDash = `${lineWidth * 2},${lineWidth * weakDashGapRatio}`;

    return (
        <>
            <FieldWitnessLinkMask boardSize={boardSize} cellMargin={cellMargin} cellSize={cellSize} filledCells={filledCells}>
                {chain.slice(1).map((candidate, index) => {
                    const previous = gameGetWitnessPoint(chain[index].cell, chain[index].value, cellSize, cellMargin);
                    const current = gameGetWitnessPoint(candidate.cell, candidate.value, cellSize, cellMargin);
                    const isStrong = candidate.link === ChainLinkEnum.STRONG;
                    const stroke = isStrong ? badgeColors.fill : theme.colors.text.hint;
                    const strokeDasharray = isStrong ? '' : weakDash;
                    const isNewest = index === chain.length - 2;
                    const strokeOpacity = isNewest ? 1 : earlierLinkOpacity;
                    const strokeWidth = isNewest ? lineWidth * newestLinkWidthRatio : lineWidth;

                    return (
                        <Line
                            key={`link-${index}`}
                            stroke={stroke}
                            strokeDasharray={strokeDasharray}
                            strokeOpacity={strokeOpacity}
                            strokeWidth={strokeWidth}
                            x1={previous.x}
                            x2={current.x}
                            y1={previous.y}
                            y2={current.y}
                        />
                    );
                })}
            </FieldWitnessLinkMask>
            {chain.map((candidate, index) => {
                const isNewest = index === chain.length - 1;
                const fill = isNewest ? badgeColors.fill : theme.colors.surface.raised;
                const textColor = isNewest ? badgeColors.text : theme.colors.text.primary;

                return (
                    <FieldWitnessCandidate
                        candidate={candidate}
                        cellMargin={cellMargin}
                        cellSize={cellSize}
                        fill={fill}
                        key={`candidate-${index}`}
                        textColor={textColor}
                    />
                );
            })}
        </>
    );
};
