import { createContext } from 'react';

import type { SharedValue } from 'react-native-reanimated';

export const ReturnableScreenChromeScrollContext = createContext<SharedValue<number> | null>(null);
