import { use } from 'react';
import Reanimated from 'react-native-reanimated';

import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { settingsFontSizeMultiplierSelector } from '../../../settings/store/settings.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { CellCandidateFontSizeConstant, CellCandidateMaxFontSizeConstant } from '../constants/dimensions.contant';

import { FieldCellCandidateStyles as styles, textCandidatePositionStyles } from './field-cell-candidate.styles';

interface Props {
    readonly candidates: number[];
}

export const FieldCellCandidates = ({ candidates }: Props) => {
    const { theme } = use(ThemeContext);

    const fontSizeMultiplier = useAppSelector(settingsFontSizeMultiplierSelector);

    const getCandidateTextStyles = (candidate: number) => {
        const textCandidateStyle = textCandidatePositionStyles[candidate as keyof typeof textCandidatePositionStyles];

        return [
            styles.textCandidate,
            {
                fontSize: Math.min(CellCandidateFontSizeConstant * fontSizeMultiplier, CellCandidateMaxFontSizeConstant),
                color: theme.colors.cell.candidate
            },
            textCandidateStyle
        ];
    };

    return candidates.map(candidate => (
        <Reanimated.Text allowFontScaling={false} key={`candidate-${candidate}`} style={getCandidateTextStyles(candidate)}>
            {candidate}
        </Reanimated.Text>
    ));
};
