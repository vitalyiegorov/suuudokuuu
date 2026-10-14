'use client';

import { track } from '@vercel/analytics';
import dynamic from 'next/dynamic';
import { useState } from 'react';

import type { DifficultyEnum } from '@suuudokuuu/generator';
import type { ReactNode } from 'react';

const DifficultyLiveBoard = dynamic(async () => (await import('../difficulty-live-board/difficulty-live-board')).DifficultyLiveBoard, {
    ssr: false
});

interface Props {
    difficulty: DifficultyEnum;
    puzzle: string;
    solution: string;
    children: ReactNode;
}

export const DifficultyPlayableBoard = ({ children, difficulty, puzzle, solution }: Props) => {
    const [isLive, setIsLive] = useState(false);
    const playLabel = isLive ? 'Loading the board…' : 'Play this puzzle here';

    const handlePlay = () => {
        track('board_opened', { difficulty });
        setIsLive(true);
    };

    return (
        <div className="difficulty-board">
            {isLive ? <DifficultyLiveBoard difficulty={difficulty} puzzle={puzzle} solution={solution} /> : null}
            <div className="difficulty-board__static">
                {children}
                <button className="hero__cta difficulty-board__play" disabled={isLive} onClick={handlePlay} type="button">
                    {playLabel}
                </button>
            </div>
        </div>
    );
};
