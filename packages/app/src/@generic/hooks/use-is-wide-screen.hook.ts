import { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';

/**
 * Breakpoint for detecting wide screens (tablets and desktops).
 * Screens with width >= 768px are considered wide screens.
 */
const WIDE_SCREEN_BREAKPOINT = 768;

/**
 * Hook to detect if the current screen is wide enough for tablet/desktop layout.
 * @returns true if screen width >= 768px, false otherwise
 */
export const useIsWideScreen = (): boolean => {
    const { width } = useWindowDimensions();
    const [isWideScreen, setIsWideScreen] = useState(width >= WIDE_SCREEN_BREAKPOINT);

    useEffect(() => {
        setIsWideScreen(width >= WIDE_SCREEN_BREAKPOINT);
    }, [width]);

    return isWideScreen;
};
