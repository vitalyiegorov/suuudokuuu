import { useLingui } from '@lingui/react';
import { SolutionTechniqueEnum } from '@suuudokuuu/solver';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../theme/context/theme.context';
import { techniqueLabelsConstant } from '../../constants/technique-labels.constant';

import { ReplayTechniqueStyles as styles } from './replay-technique.styles';

import type { MoveClassificationInterface } from '@suuudokuuu/solver';

interface Props {
    readonly classification: MoveClassificationInterface | null;
}

export const ReplayTechnique = ({ classification }: Props) => {
    const { _ } = useLingui();
    const { theme } = use(ThemeContext);
    let content = null;

    if (classification !== null) {
        const techniqueLabel = _(techniqueLabelsConstant[classification.technique]);
        const textColor = classification.technique === SolutionTechniqueEnum.Guess ? theme.colors.red : theme.colors.label.main;
        const textStyles = [styles.text, { color: textColor }];

        content = <BlackText numberOfLines={1} style={textStyles}>{`${techniqueLabel} ${classification.value}`}</BlackText>;
    }

    return <View style={styles.container}>{content}</View>;
};
