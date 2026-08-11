'use client';

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
    children: ReactNode;
}

export const TechniquePlayableBoard = ({ board, children, technique }: Props) => {
    const [isLive, setIsLive] = useState(false);
    const isStaticOpen = !isLive;

    const handleStart = () => {
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
