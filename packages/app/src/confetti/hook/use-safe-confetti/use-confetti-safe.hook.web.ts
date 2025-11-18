import { RefObject } from 'react';
import { type ConfettiRef } from 'typegpu-confetti';
import { useConfetti } from 'typegpu-confetti/react-native';

/** HINT: https://developer.mozilla.org/en-US/docs/Web/API/GPU/requestAdapter */
export const useConfettiSafe = () => {
    try {
        return useConfetti();
    } catch {
        return {
            current: null
        } as RefObject<ConfettiRef | null>;
    }
};
