import { useLingui } from '@lingui/react/macro';

import { isNotEmptyString } from '@rnw-community/shared';

import { Alert } from '../../@generic/components/alert/alert';
import { useCurrentRun } from '../query/use-current-run.query';

export const useConfirmRunReplacement = () => {
    const { t } = useLingui();
    const { sudokuString } = useCurrentRun();
    const isGameStarted = isNotEmptyString(sudokuString);

    return (startRun: () => void) => {
        if (!isGameStarted) {
            startRun();

            return;
        }

        Alert(t`Stop current run?`, t`All progress will be lost`, [
            { text: t`Cancel`, style: 'cancel' },
            { text: t`OK`, onPress: startRun }
        ]);
    };
};
