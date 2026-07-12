import { useAnimatedScrollHandler } from 'react-native-reanimated';

import { useReturnableScreenChromeScrollValue } from './use-returnable-screen-chrome-scroll-value.hook';

export const useReturnableScreenChromeScrollHandler = () => {
    const scrollY = useReturnableScreenChromeScrollValue();

    return useAnimatedScrollHandler({
        onScroll: event => {
            scrollY.value = Math.max(event.contentOffset.y, 0);
        }
    });
};
