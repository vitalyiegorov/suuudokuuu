import { i18n } from '@lingui/core';
import { msg } from '@lingui/core/macro';

export const donationGetText = (type: 'loser' | 'paused' | 'winner') => {
    if (type === 'winner') {
        return i18n._(msg`You won and Ukraine needs to!\n\nEvery 1$ donation matters!`);
    } else if (type === 'loser') {
        return i18n._(msg`You lost but Ukraine must win!\n\nEvery 1$ donation matters!`);
    }

    return i18n._(msg`While you were away Ukraine continued its fight for freedom!\n\nEvery 1$ donation matters!`);
};
