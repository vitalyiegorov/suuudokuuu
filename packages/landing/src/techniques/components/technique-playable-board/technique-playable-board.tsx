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
    const [hasLoadedLive, setHasLoadedLive] = useState(false);

    const handleShowStatic = () => void setIsLive(false);

    const handleShowLive = () => {
        if (!hasLoadedLive) {
            track('island_opened', { technique: techniqueName });
            setHasLoadedLive(true);
        }

        setIsLive(true);
    };

    const livePanel = hasLoadedLive ? (
        <div
            aria-labelledby="technique-embed-live-tab"
            className="technique-embed__panel"
            hidden={!isLive}
            id="technique-embed-live"
            role="tabpanel"
        >
            <TechniqueLiveBoard board={board} technique={technique} />
        </div>
    ) : null;

    return (
        <div className="technique-embed">
            <div aria-label="Worked example view" className="technique-embed__tabs" role="tablist">
                <button
                    aria-controls="technique-embed-static"
                    aria-selected={!isLive}
                    className="technique-embed__tab"
                    id="technique-embed-static-tab"
                    onClick={handleShowStatic}
                    role="tab"
                    type="button"
                >
                    Worked example
                </button>
                <button
                    aria-controls="technique-embed-live"
                    aria-selected={isLive}
                    className="technique-embed__tab"
                    id="technique-embed-live-tab"
                    onClick={handleShowLive}
                    role="tab"
                    type="button"
                >
                    Try it on a live board
                </button>
            </div>
            <div
                aria-labelledby="technique-embed-static-tab"
                className="technique-embed__panel technique-embed__static"
                hidden={isLive}
                id="technique-embed-static"
                role="tabpanel"
            >
                {children}
            </div>
            {livePanel}
        </div>
    );
};
