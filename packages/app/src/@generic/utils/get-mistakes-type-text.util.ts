import { t } from '@lingui/core/macro';

export const getMistakesTypeText = (maxMistakes: number): string => {
    if (maxMistakes === 0) {
        return t`Hardcore`;
    }

    if (maxMistakes === 3) {
        return t`Standard`;
    }

    return t`Relaxed`;
};
