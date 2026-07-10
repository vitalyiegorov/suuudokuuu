import { use } from 'react';
import Reanimated from 'react-native-reanimated';

import { cs } from '@rnw-community/shared';

import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { settingsFontSizeMultiplierSelector, settingsKeySelector } from '../../../settings/store/settings.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';

import { FieldCellCandidateStyles as styles } from './field-cell-candidate.styles';

interface Props {
    readonly activeValue?: number;
    readonly candidates: number[];
    readonly cellSize: number;
}

const textCandidatePositionStyles = {
    1: styles.textCandidatePosition1,
    2: styles.textCandidatePosition2,
    3: styles.textCandidatePosition3,
    4: styles.textCandidatePosition4,
    5: styles.textCandidatePosition5,
    6: styles.textCandidatePosition6,
    7: styles.textCandidatePosition7,
    8: styles.textCandidatePosition8,
    9: styles.textCandidatePosition9
};

export const FieldCellCandidates = ({ candidates, activeValue, cellSize }: Props) => {
    const { theme } = use(ThemeContext);

    const fontSizeMultiplier = useAppSelector(settingsFontSizeMultiplierSelector);
    const showActiveCandidates = useAppSelector(settingsKeySelector('showActiveCandidates'));

    const getCandidateTextStyles = (candidate: number) => {
        const textCandidatePositionStyle = textCandidatePositionStyles[candidate as keyof typeof textCandidatePositionStyles];
        const isCandidateActive = candidate === activeValue;

        return [
            styles.textCandidate(cellSize),
            {
                fontSize: Math.min((cellSize / 3) * fontSizeMultiplier, cellSize / 3.7),
                color: theme.colors.candidate.text
            },
            cs(isCandidateActive && showActiveCandidates, {
                backgroundColor: theme.colors.candidate.bgActive,
                color: theme.colors.candidate.textActive
            }),
            textCandidatePositionStyle(cellSize)
        ];
    };

    return candidates.map(candidate => (
        <Reanimated.Text allowFontScaling={false} key={`candidate-${candidate}`} style={getCandidateTextStyles(candidate)}>
            {candidate}
        </Reanimated.Text>
    ));
};
