import { use } from 'react';
import { Circle, Text } from 'react-native-svg';

import { ThemeContext } from '../../../theme/context/theme.context';
import { gameGetWitnessBadgeColors } from '../../utils/game-get-witness-badge-colors.util';

import type { WitnessBadgeInterface } from '../../interface/witness-badge.interface';

const badgeStrokeRatio = 0.05;
const badgeStrokeMinimumWidth = 1.5;
const digitSizeRatio = 4 / 3;
const digitBaselineRatio = 0.35;

interface Props {
    readonly badge: WitnessBadgeInterface;
    readonly cellSize: number;
    readonly fill: string;
    readonly textColor: string;
}

export const FieldWitnessCandidate = ({ badge, cellSize, fill, textColor }: Props) => {
    const { theme } = use(ThemeContext);
    const digitSize = badge.radius * digitSizeRatio;
    const digitBaseline = badge.y + digitSize * digitBaselineRatio;
    const badgeStroke = gameGetWitnessBadgeColors(theme).fill;
    const strokeWidth = Math.max(badgeStrokeMinimumWidth, cellSize * badgeStrokeRatio);

    return (
        <>
            <Circle cx={badge.x} cy={badge.y} fill={fill} r={badge.radius} stroke={badgeStroke} strokeWidth={strokeWidth} />
            <Text fill={textColor} fontSize={digitSize} fontFamily="Inter_700Bold" textAnchor="middle" x={badge.x} y={digitBaseline}>
                {badge.value}
            </Text>
        </>
    );
};
