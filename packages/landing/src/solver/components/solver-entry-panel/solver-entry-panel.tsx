import { useState } from 'react';

import { EMPTY_PUZZLE_ENTRY, ENTRY_FIRST_CELL_INDEX, SAMPLE_PUZZLE_ENTRY } from '../../constants/puzzle-entry.constant';
import { normalizePuzzleEntry } from '../../utils/normalize-puzzle-entry.util';
import { replaceEntryValue } from '../../utils/replace-entry-value.util';
import { SolverEntryBoard } from '../solver-entry-board/solver-entry-board';
import { SolverEntryPad } from '../solver-entry-pad/solver-entry-pad';

import type { ChangeEvent } from 'react';

const ENTRY_INPUT_ID = 'solver-entry-string';

interface Props {
    isSolving: boolean;
    onSolve: (entry: string) => void;
    onEntryChange: () => void;
}

export const SolverEntryPanel = ({ isSolving, onEntryChange, onSolve }: Props) => {
    const [entry, setEntry] = useState(EMPTY_PUZZLE_ENTRY);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const solveLabel = isSolving ? 'Solving…' : 'Solve step by step';

    const applyEntry = (nextEntry: string) => {
        setEntry(nextEntry);
        onEntryChange();
    };

    const handleEnterValue = (character: string) => {
        const index = selectedIndex ?? ENTRY_FIRST_CELL_INDEX;

        setSelectedIndex(index);
        applyEntry(replaceEntryValue(entry, index, character));
    };

    const handlePasteChange = (event: ChangeEvent<HTMLInputElement>) => {
        applyEntry(normalizePuzzleEntry(event.target.value));
    };

    const handleLoadSample = () => {
        setSelectedIndex(null);
        applyEntry(SAMPLE_PUZZLE_ENTRY);
    };

    const handleClear = () => {
        setSelectedIndex(null);
        applyEntry(EMPTY_PUZZLE_ENTRY);
    };

    const handleSolve = () => {
        onSolve(entry);
    };

    return (
        <div className="solver-entry">
            <SolverEntryBoard entry={entry} onEnterValue={handleEnterValue} onSelect={setSelectedIndex} selectedIndex={selectedIndex} />
            <SolverEntryPad onEnterValue={handleEnterValue} />
            <label className="solver-entry__label" htmlFor={ENTRY_INPUT_ID}>
                Or paste an 81-character puzzle — digits for givens, dots or zeros for blanks.
            </label>
            <input
                autoComplete="off"
                className="solver-entry__input"
                id={ENTRY_INPUT_ID}
                onChange={handlePasteChange}
                spellCheck={false}
                value={entry}
            />
            <div className="solver-entry__actions">
                <button className="solver-entry__solve" disabled={isSolving} onClick={handleSolve} type="button">
                    {solveLabel}
                </button>
                <button className="solver-entry__action" onClick={handleLoadSample} type="button">
                    Load a sample puzzle
                </button>
                <button className="solver-entry__action" onClick={handleClear} type="button">
                    Clear the grid
                </button>
            </div>
        </div>
    );
};
