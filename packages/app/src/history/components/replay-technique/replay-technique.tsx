import { useLingui } from '@lingui/react';
import { SolutionTechniqueEnum } from '@suuudokuuu/solver';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../theme/context/theme.context';
import { techniqueLabelsConstant } from '../../constants/technique-labels.constant';

import { ReplayTechniqueStyles as styles } from './replay-technique.styles';

import type { TechniqueResultInterface } from '@suuudokuuu/solver';

interface Props {
    readonly result: Pick<TechniqueResultInterface, 'technique' | 'value'> | null;
}

export const ReplayTechnique = ({ result }: Props) => {
    const { _ } = useLingui();
    const { theme } = use(ThemeContext);

    if (result === null) {
        return null;
    }

    const techniqueLabel = _(techniqueLabelsConstant[result.technique]);
    const textColor = result.technique === SolutionTechniqueEnum.Guess ? theme.colors.red : theme.colors.label.main;
    const textStyles = [styles.text, { color: textColor }];

    return (
        <View style={styles.container}>
            <BlackText numberOfLines={1} style={textStyles}>{`${techniqueLabel} ${result.value}`}</BlackText>
        </View>
    );
};
