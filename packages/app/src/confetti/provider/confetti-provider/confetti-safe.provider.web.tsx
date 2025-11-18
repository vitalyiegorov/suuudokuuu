import { ReactNode } from 'react';
import { ConfettiProvider } from 'typegpu-confetti/react-native';

interface Props {
    children: ReactNode;
}

/** HINT: https://developer.mozilla.org/en-US/docs/Web/API/GPU/requestAdapter */
export const ConfettiSafeProvider = ({ children }: Props) => {
    if ('gpu' in navigator) {
        return <ConfettiProvider>{children}</ConfettiProvider>;
    }

    return children;
};
