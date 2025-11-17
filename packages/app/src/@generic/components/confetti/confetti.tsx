import { forwardRef } from 'react';
import { type ConfettiMethods, Confetti as ConfettiNative, type ConfettiProps } from 'react-native-fast-confetti';

export type { ConfettiMethods };

export const Confetti = forwardRef<ConfettiMethods, ConfettiProps>((props, ref) => <ConfettiNative ref={ref} {...props} />);

// eslint-disable-next-line lingui/no-unlocalized-strings
Confetti.displayName = 'Confetti';
