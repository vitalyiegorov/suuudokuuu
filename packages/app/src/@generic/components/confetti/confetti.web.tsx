import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Confetti as ConfettiWeb } from 'typegpu-confetti/react';

import { type ConfettiMethods, type ConfettiRefInternal, createConfettiMethods, hexToRgba } from './confetti-utils';

import type { ForwardedRef } from 'react';


export interface ConfettiProps {
    [key: string]: unknown;
    autoplay?: boolean;
    count?: number;
    isInfinite?: boolean;
    colors?: string[];
}

export type { ConfettiMethods };

// Web implementation with typegpu-confetti/react
export const Confetti = forwardRef<ConfettiMethods, ConfettiProps>(({ colors, count = 300 }, ref: ForwardedRef<ConfettiMethods>) => {
    const confettiRef = useRef<ConfettiRefInternal>(null);

    useImperativeHandle(ref, () => createConfettiMethods(confettiRef, count as number));

    const colorPalette = (colors as string[] | undefined)?.map(hexToRgba);

    return (
        <ConfettiWeb
            ref={confettiRef}
            initParticleAmount={0}
            maxParticleAmount={count as number}
            colorPalette={colorPalette}
            maxDurationTime={3}
        />
    );
});

// eslint-disable-next-line lingui/no-unlocalized-strings
Confetti.displayName = 'Confetti';
