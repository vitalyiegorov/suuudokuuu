import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import { ThemeContext } from '../../../theme/context/theme.context';

import { ReplayTechniqueSelectors } from './replay-technique.selectors';
import { ReplayTechniqueStyles as styles } from './replay-technique.styles';

import type { MoveClassificationInterface } from '@suuudokuuu/techniques';

interface Props {
    readonly classification: MoveClassificationInterface | null;
    readonly isHinted: boolean;
}

export const ReplayTechnique = ({ classification, isHinted }: Props) => {
    const { _ } = useLingui();
    const { theme } = use(ThemeContext);
    let content = null;

    if (classification !== null) {
        const techniqueLabel = _(techniqueLabelsConstant[classification.technique]);
        const textColor = classification.technique === SolutionTechniqueEnum.Guess ? theme.colors.danger : theme.colors.text.primary;
        const textStyles = [styles.text, { color: textColor }];
        const badgeStyles = [styles.badge, { borderColor: theme.colors.surface.border, color: theme.colors.text.hint }];

        content = (
            <>
                <BlackText numberOfLines={1} style={textStyles} testID={ReplayTechniqueSelectors.Technique}>
                    {`${techniqueLabel} ${classification.value}`}
                </BlackText>
                {isHinted ? (
                    <BlackText style={badgeStyles} testID={ReplayTechniqueSelectors.HintBadge}>
                        <Trans>via hint</Trans>
                    </BlackText>
                ) : null}
            </>
        );
    }

    return <View style={styles.container}>{content}</View>;
};
