import { createContext } from 'react';
import Animated, { AnimatedRef, ScrollHandlerProcessed, SharedValue } from 'react-native-reanimated';

import { ColorSchemeEnum } from '../enum/color-scheme.enum';
import { ScreenChromeConfigInterface } from '../interface/screen-chrome-config.interface';

export interface ScreenChromeContextValueInterface {
    readonly colorScheme: ColorSchemeEnum;
    readonly config: ScreenChromeConfigInterface;
    readonly scrollY: SharedValue<number>;
    readonly scrollHandler: ScrollHandlerProcessed;
    readonly scrollRef: AnimatedRef<Animated.ScrollView>;
}

export const ScreenChromeContext = createContext<ScreenChromeContextValueInterface | null>(null);
