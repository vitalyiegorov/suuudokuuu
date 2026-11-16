import { Trans, useLingui } from '@lingui/react/macro';
import { CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { View } from 'react-native';

import { isNotEmptyArray } from '@rnw-community/shared';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { ImportCellToneEnum } from '../enums/import-cell-tone.enum';
import { ImportLegendSample } from '../import-legend-sample/import-legend-sample';
import { ImportScreenSelectors } from '../import-screen.selectors';

import { ImportLegendStyles as styles } from './import-legend.styles';

import type { ImportReviewStateInterface } from '../interface/import-review-state.interface';

const digitPattern = /[1-9]/u;

interface Props {
    readonly puzzleString: string;
    readonly review: Pick<ImportReviewStateInterface, 'entryString' | 'uncertainCellIndexes'>;
}

export const ImportLegend = ({ puzzleString, review }: Props) => {
    const { t } = useLingui();

    const hasEntries = digitPattern.test(review.entryString);
    const hasUncertain = isNotEmptyArray(review.uncertainCellIndexes);
    const hasDigits = hasEntries || digitPattern.test(puzzleString);

    return (
        <View style={styles.legend} testID={ImportScreenSelectors.Legend}>
            {hasEntries || hasUncertain ? (
                <View style={styles.samples}>
                    <ImportLegendSample text={t`Clue`} tone={ImportCellToneEnum.CLUE} />
                    {hasEntries ? <ImportLegendSample text={t`Your entry`} tone={ImportCellToneEnum.ENTRY} /> : null}
                    {hasUncertain ? <ImportLegendSample text={t`Check`} tone={ImportCellToneEnum.UNCERTAIN} /> : null}
                </View>
            ) : null}
            <BlackText maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant} style={styles.line}>
                {hasDigits ? <Trans>Tap a cell to change it</Trans> : <Trans>Tap a cell to type it</Trans>}
            </BlackText>
        </View>
    );
};
