import { forwardRef } from 'react';

import type { ForwardedRef } from 'react';

export interface ConfettiMethods {
    restart: (options?: unknown) => void;
    pause: () => void;
    reset: () => void;
    resume: () => void;
}

export interface ConfettiProps {
    [key: string]: unknown;
    autoplay?: boolean;
    count?: number;
    isInfinite?: boolean;
    colors?: string[];
}

// Web stub - no-op implementation since react-native-skia doesn't support web
export const Confetti = forwardRef<ConfettiMethods, ConfettiProps>((_props, _ref: ForwardedRef<ConfettiMethods>) => 
    // On web, we simply don't render anything
    // The confetti library requires react-native-skia which doesn't support web
     null
);

// eslint-disable-next-line lingui/no-unlocalized-strings
Confetti.displayName = 'Confetti';
