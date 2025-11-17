import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Confetti as ConfettiNative } from 'typegpu-confetti/react-native';

import { type ConfettiMethods, type ConfettiRefInternal, createConfettiMethods, hexToRgba } from './confetti-utils';

interface ConfettiProps {
    autoplay?: boolean;
    count?: number;
    isInfinite?: boolean;
    colors?: string[];
}

export type { ConfettiMethods };

export const Confetti = forwardRef<ConfettiMethods, ConfettiProps>(({ colors, count = 300 }, ref) => {
    const confettiRef = useRef<ConfettiRefInternal>(null);

    useImperativeHandle(ref, () => createConfettiMethods(confettiRef, count));

    const colorPalette = colors?.map(hexToRgba);

    return (
        <ConfettiNative
            ref={confettiRef}
            initParticleAmount={0}
            maxParticleAmount={count}
            colorPalette={colorPalette}
            maxDurationTime={3}
        />
    );
});

// eslint-disable-next-line lingui/no-unlocalized-strings
Confetti.displayName = 'Confetti';
