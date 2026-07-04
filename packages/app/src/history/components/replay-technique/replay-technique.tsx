import { useLingui } from '@lingui/react/macro';
import { SolutionTechniqueEnum } from '@suuudokuuu/generator';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../theme/context/theme.context';

import { ReplayTechniqueStyles as styles } from './replay-technique.styles';

import type { SolutionStepInterface } from '@suuudokuuu/encoder';

interface Props {
    readonly step: SolutionStepInterface | null;
}

export const ReplayTechnique = ({ step }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    if (step === null) {
        return null;
    }

    const techniqueLabels: Partial<Record<number, string>> = {
        [SolutionTechniqueEnum.Guess]: t`Guess`,
        [SolutionTechniqueEnum.FullHouse]: t`Full House`,
        [SolutionTechniqueEnum.NakedSingle]: t`Naked Single`,
        [SolutionTechniqueEnum.HiddenSingle]: t`Hidden Single`,
        [SolutionTechniqueEnum.PointingPair]: t`Pointing Pair`,
        [SolutionTechniqueEnum.PointingTriple]: t`Pointing Triple`,
        [SolutionTechniqueEnum.BoxLineReduction]: t`Box-Line Reduction`,
        [SolutionTechniqueEnum.NakedPair]: t`Naked Pair`,
        [SolutionTechniqueEnum.NakedTriple]: t`Naked Triple`,
        [SolutionTechniqueEnum.NakedQuad]: t`Naked Quad`,
        [SolutionTechniqueEnum.HiddenPair]: t`Hidden Pair`,
        [SolutionTechniqueEnum.HiddenTriple]: t`Hidden Triple`,
        [SolutionTechniqueEnum.HiddenQuad]: t`Hidden Quad`,
        [SolutionTechniqueEnum.XWing]: t`X-Wing`,
        [SolutionTechniqueEnum.Swordfish]: t`Swordfish`,
        [SolutionTechniqueEnum.Jellyfish]: t`Jellyfish`,
        [SolutionTechniqueEnum.FinnedXWing]: t`Finned X-Wing`,
        [SolutionTechniqueEnum.FinnedSwordfish]: t`Finned Swordfish`,
        [SolutionTechniqueEnum.SashimiXWing]: t`Sashimi X-Wing`,
        [SolutionTechniqueEnum.SashimiSwordfish]: t`Sashimi Swordfish`,
        [SolutionTechniqueEnum.XYWing]: t`XY-Wing`,
        [SolutionTechniqueEnum.XYZWing]: t`XYZ-Wing`,
        [SolutionTechniqueEnum.WWing]: t`W-Wing`,
        [SolutionTechniqueEnum.XChain]: t`X-Chain`,
        [SolutionTechniqueEnum.XYChain]: t`XY-Chain`,
        [SolutionTechniqueEnum.SimpleColoring]: t`Simple Coloring`,
        [SolutionTechniqueEnum.AIC]: t`AIC`
    };
    const guessLabel = techniqueLabels[SolutionTechniqueEnum.Guess] ?? t`Guess`;
    const techniqueLabel = techniqueLabels[step.technique] ?? guessLabel;
    const textStyles = [
        styles.text,
        {
            color: step.isGuessLike ? theme.colors.red : theme.colors.label.main
        }
    ];

    return (
        <View style={styles.container}>
            <BlackText style={textStyles}>{`${techniqueLabel} ${step.value}`}</BlackText>
        </View>
    );
};
