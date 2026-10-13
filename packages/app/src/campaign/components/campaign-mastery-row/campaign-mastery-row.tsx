import { Trans, useLingui } from '@lingui/react/macro';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';

import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

interface Props {
    readonly technique: SolutionTechniqueEnum;
    readonly seenCount: number;
    readonly unassistedCount: number;
}

export const CampaignMasteryRow = ({ technique, seenCount, unassistedCount }: Props) => {
    const { i18n } = useLingui();

    return (
        <View>
            <BlackText>{i18n._(techniqueLabelsConstant[technique])}</BlackText>
            <BlackText>
                <Trans>
                    Seen: {seenCount} · Unassisted: {unassistedCount}
                </Trans>
            </BlackText>
        </View>
    );
};
