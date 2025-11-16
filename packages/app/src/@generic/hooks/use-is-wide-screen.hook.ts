import { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';

const WIDE_SCREEN_BREAKPOINT = 768;

export const useIsWideScreen = (): boolean => {
    const { width } = useWindowDimensions();
    const [isWideScreen, setIsWideScreen] = useState(width >= WIDE_SCREEN_BREAKPOINT);

    useEffect(() => {
        setIsWideScreen(width >= WIDE_SCREEN_BREAKPOINT);
    }, [width]);

    return isWideScreen;
};
