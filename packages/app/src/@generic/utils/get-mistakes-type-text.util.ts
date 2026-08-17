import { msg } from '@lingui/core/macro';

import type { MessageDescriptor } from '@lingui/core';

export const getMistakesTypeText = (maxMistakes: number): MessageDescriptor => {
    if (maxMistakes === 0) {
        return msg`Hardcore`;
    }

    if (maxMistakes === 3) {
        return msg`Standard`;
    }

    return msg`Relaxed`;
};
