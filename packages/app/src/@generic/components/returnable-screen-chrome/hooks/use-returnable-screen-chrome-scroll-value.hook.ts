import { use } from 'react';
import { useSharedValue } from 'react-native-reanimated';

import { isDefined } from '@rnw-community/shared';

import { ReturnableScreenChromeScrollContext } from '../context/returnable-screen-chrome-scroll.context';

export const useReturnableScreenChromeScrollValue = () => {
    const fallbackScrollY = useSharedValue(0);
    const scrollY = use(ReturnableScreenChromeScrollContext);

    return isDefined(scrollY) ? scrollY : fallbackScrollY;
};
