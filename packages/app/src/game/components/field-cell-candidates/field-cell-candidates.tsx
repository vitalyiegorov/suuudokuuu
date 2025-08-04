import { use } from 'react';
import Reanimated from 'react-native-reanimated';

import { cs } from '@rnw-community/shared';

import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { settingsFontSizeMultiplierSelector, settingsKeySelector } from '../../../settings/store/settings.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { CellCandidateFontSizeConstant, CellCandidateMaxFontSizeConstant } from '../constants/dimensions.contant';

import { FieldCellCandidateStyles as styles, textCandidatePositionStyles } from './field-cell-candidate.styles';

interface Props {
    readonly activeValue?: number;
    readonly candidates: number[];
}

export const FieldCellCandidates = ({ candidates, activeValue }: Props) => {
    const { theme } = use(ThemeContext);

    const fontSizeMultiplier = useAppSelector(settingsFontSizeMultiplierSelector);
    const showActiveCandidates = useAppSelector(settingsKeySelector('showActiveCandidates'));

    const getCandidateTextStyles = (candidate: number) => {
        const textCandidateStyle = textCandidatePositionStyles[candidate as keyof typeof textCandidatePositionStyles];
        const isCandidateActive = candidate === activeValue;

        return [
            styles.textCandidate,
            {
                fontSize: Math.min(CellCandidateFontSizeConstant * fontSizeMultiplier, CellCandidateMaxFontSizeConstant),
                color: theme.colors.cell.candidate
            },
            cs(isCandidateActive && showActiveCandidates, {
                backgroundColor: theme.colors.cell.candidateActiveBg,
                color: theme.colors.cell.candidateActive
            }),
            textCandidateStyle
        ];
    };

    return candidates.map(candidate => (
        <Reanimated.Text allowFontScaling={false} key={`candidate-${candidate}`} style={getCandidateTextStyles(candidate)}>
            {candidate}
        </Reanimated.Text>
    ));
};
