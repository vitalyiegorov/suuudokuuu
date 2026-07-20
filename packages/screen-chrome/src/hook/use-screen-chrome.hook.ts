import { use } from 'react';

import { isDefined } from '@rnw-community/shared';

import { ScreenChromeContext, ScreenChromeContextValueInterface } from '../context/screen-chrome.context';

export const useScreenChrome = (): ScreenChromeContextValueInterface => {
    const context = use(ScreenChromeContext);

    if (!isDefined(context)) {
        throw new Error('useScreenChrome must be used within ScreenChromeProvider');
    }

    return context;
};
