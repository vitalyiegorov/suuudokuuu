'use client';

import { track } from '@vercel/analytics';
import dynamic from 'next/dynamic';
import { useState } from 'react';

import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import type { ReactNode } from 'react';

const TechniqueLiveBoard = dynamic(async () => (await import('../technique-live-board/technique-live-board')).TechniqueLiveBoard, {
    ssr: false
});

interface Props {
    board: string;
    technique: SolutionTechniqueEnum;
    techniqueName: string;
    children: ReactNode;
}

export const TechniquePlayableBoard = ({ board, children, technique, techniqueName }: Props) => {
    const [isLive, setIsLive] = useState(false);
    const isStaticOpen = !isLive;

    const handleStart = () => {
        track('island_opened', { technique: techniqueName });
        setIsLive(true);
    };

    const liveBoard = isLive ? (
        <TechniqueLiveBoard board={board} technique={technique} />
    ) : (
        <button className="technique-embed__start" onClick={handleStart} type="button">
            Try it on a live board
        </button>
    );

    return (
        <div className="technique-embed">
            <details className="technique-embed__static" open={isStaticOpen}>
                <summary className="technique-embed__static-summary">Worked example diagram</summary>
                {children}
            </details>
            {liveBoard}
        </div>
    );
};
