import { useLingui } from '@lingui/react/macro';
import { View } from 'react-native';

import { isNotEmptyArray } from '@rnw-community/shared';

import { ImportCellToneEnum } from '../enums/import-cell-tone.enum';
import { ImportLegendSample } from '../import-legend-sample/import-legend-sample';
import { ImportScreenSelectors } from '../import-screen.selectors';

import { ImportLegendStyles as styles } from './import-legend.styles';

import type { ImportReviewStateInterface } from '../interface/import-review-state.interface';

const digitPattern = /[1-9]/u;

interface Props {
    readonly puzzleString: string;
    readonly review: Pick<ImportReviewStateInterface, 'entryString' | 'uncertainCellIndexes' | 'isRecognizing'>;
}

export const ImportLegend = ({ puzzleString, review }: Props) => {
    const { t } = useLingui();

    const hasEntries = digitPattern.test(review.entryString);
    const hasUncertain = isNotEmptyArray(review.uncertainCellIndexes);
    const hasDigits = hasEntries || digitPattern.test(puzzleString);

    return hasDigits && !review.isRecognizing ? (
        <View style={styles.legend} testID={ImportScreenSelectors.Legend}>
            <ImportLegendSample text={t`Given`} tone={ImportCellToneEnum.CLUE} />
            {hasEntries ? <ImportLegendSample text={t`Filled in`} tone={ImportCellToneEnum.ENTRY} /> : null}
            {hasUncertain ? <ImportLegendSample text={t`Check`} tone={ImportCellToneEnum.UNCERTAIN} /> : null}
        </View>
    ) : null;
};
