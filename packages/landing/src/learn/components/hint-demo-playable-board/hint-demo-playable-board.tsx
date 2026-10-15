'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

import type { ReactNode } from 'react';

const HintDemoLiveBoard = dynamic(async () => (await import('../hint-demo-live-board/hint-demo-live-board')).HintDemoLiveBoard, {
    ssr: false
});

interface Props {
    puzzle: string;
    children: ReactNode;
}

export const HintDemoPlayableBoard = ({ children, puzzle }: Props) => {
    const [isLive, setIsLive] = useState(false);

    const handleStart = () => void setIsLive(true);

    if (isLive) {
        return <HintDemoLiveBoard puzzle={puzzle} />;
    }

    return (
        <div className="difficulty-board">
            <div className="difficulty-board__static">
                {children}
                <button className="hero__cta difficulty-board__play" onClick={handleStart} type="button">
                    Try the hint stepper
                </button>
            </div>
        </div>
    );
};
