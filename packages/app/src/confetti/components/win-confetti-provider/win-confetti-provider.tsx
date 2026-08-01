import { useEffect, useRef, useState } from 'react';

import { isDefined } from '@rnw-community/shared';

import { winConfettiCelebrationDurationConstant } from '../../constants/win-confetti.constant';
import { WinConfettiContext } from '../../context/win-confetti.context';
import { ConfettiBurst } from '../confetti-burst/confetti-burst';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const WinConfettiProvider = ({ children }: Props) => {
    const [isCelebrating, setIsCelebrating] = useState(false);

    const celebrationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleCelebrationStart = () => {
        if (isDefined(celebrationTimeoutRef.current)) {
            clearTimeout(celebrationTimeoutRef.current);
        }

        setIsCelebrating(true);

        celebrationTimeoutRef.current = setTimeout(() => void setIsCelebrating(false), winConfettiCelebrationDurationConstant * 1000);
    };

    useEffect(
        () => () => {
            if (isDefined(celebrationTimeoutRef.current)) {
                clearTimeout(celebrationTimeoutRef.current);
            }
        },
        []
    );

    const confettiOverlay = isCelebrating ? <ConfettiBurst /> : null;

    return (
        <WinConfettiContext.Provider value={handleCelebrationStart}>
            {children}
            {confettiOverlay}
        </WinConfettiContext.Provider>
    );
};
