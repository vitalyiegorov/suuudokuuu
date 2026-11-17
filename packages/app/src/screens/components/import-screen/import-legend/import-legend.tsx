import { Trans, useLingui } from '@lingui/react/macro';
import { CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { View, useWindowDimensions } from 'react-native';

import { isDefined, isNotEmptyArray } from '@rnw-community/shared';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { ImportCompactFrameHeightConstant } from '../constants/import-compact-frame-height.constant';
import { ImportCellToneEnum } from '../enums/import-cell-tone.enum';
import { ImportLegendSample } from '../import-legend-sample/import-legend-sample';
import { ImportScreenSelectors } from '../import-screen.selectors';

import { ImportLegendStyles as styles } from './import-legend.styles';

import type { ImportReviewStateInterface } from '../interface/import-review-state.interface';

const digitPattern = /[1-9]/u;

interface Props {
    readonly puzzleString: string;
    readonly review: Pick<ImportReviewStateInterface, 'entryString' | 'uncertainCellIndexes' | 'selectedCellIndex' | 'isRecognizing'>;
}

export const ImportLegend = ({ puzzleString, review }: Props) => {
    const { t } = useLingui();
    const { fontScale, height } = useWindowDimensions();

    const hasEntries = digitPattern.test(review.entryString);
    const hasUncertain = isNotEmptyArray(review.uncertainCellIndexes);
    const hasDigits = hasEntries || digitPattern.test(puzzleString);
    const hasSamples = (hasEntries || hasUncertain) && (fontScale <= 1 || height >= ImportCompactFrameHeightConstant);

    if (!hasDigits || isDefined(review.selectedCellIndex) || review.isRecognizing) {
        return null;
    }

    return (
        <View style={styles.legend} testID={ImportScreenSelectors.Legend}>
            {hasSamples ? (
                <View style={styles.samples}>
                    <ImportLegendSample text={t`Clue`} tone={ImportCellToneEnum.CLUE} />
                    {hasEntries ? <ImportLegendSample text={t`My entry`} tone={ImportCellToneEnum.ENTRY} /> : null}
                    {hasUncertain ? <ImportLegendSample text={t`Check`} tone={ImportCellToneEnum.UNCERTAIN} /> : null}
                </View>
            ) : null}
            <BlackText maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant} style={styles.line}>
                <Trans>Tap a cell to change it</Trans>
            </BlackText>
        </View>
    );
};
