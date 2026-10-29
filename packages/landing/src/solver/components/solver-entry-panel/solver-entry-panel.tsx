import { useState } from 'react';

import { EMPTY_PUZZLE_ENTRY, ENTRY_CELL_COUNT, ENTRY_FIRST_CELL_INDEX, SAMPLE_PUZZLE_ENTRY } from '../../constants/puzzle-entry.constant';
import { readPuzzleEntryCells } from '../../utils/read-puzzle-entry-cells.util';
import { replaceEntryValue } from '../../utils/replace-entry-value.util';
import { SolverEntryBoard } from '../solver-entry-board/solver-entry-board';
import { SolverEntryCountNotice } from '../solver-entry-count-notice/solver-entry-count-notice';
import { SolverEntryLinkNotice } from '../solver-entry-link-notice/solver-entry-link-notice';
import { SolverEntryPad } from '../solver-entry-pad/solver-entry-pad';

import type { ChangeEvent } from 'react';

const ENTRY_INPUT_ID = 'solver-entry-string';
const SHARED_LINK_MARKER = '/shared/';

interface Props {
    isSolving: boolean;
    onSolve: (entry: string) => void;
    onEntryChange: () => void;
}

export const SolverEntryPanel = ({ isSolving, onEntryChange, onSolve }: Props) => {
    const [entry, setEntry] = useState(EMPTY_PUZZLE_ENTRY);
    const [entryText, setEntryText] = useState(EMPTY_PUZZLE_ENTRY);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [isLinkUnreadable, setIsLinkUnreadable] = useState(false);
    const solveLabel = isSolving ? 'Solving…' : 'Solve step by step';
    const entryTextCellCount = readPuzzleEntryCells(entryText).length;
    const isEntryTextLink = entryText.includes(SHARED_LINK_MARKER);
    const isEntryTextIncomplete = !isEntryTextLink && entryTextCellCount !== ENTRY_CELL_COUNT;
    const isSolveDisabled = isSolving || isEntryTextLink || isLinkUnreadable || isEntryTextIncomplete;

    const applyEntry = (nextEntry: string) => {
        setEntry(nextEntry);
        setEntryText(nextEntry);
        setIsLinkUnreadable(false);
        onEntryChange();
    };

    const handleUnreadableLink = () => {
        setIsLinkUnreadable(true);
    };

    const handleEnterValue = (character: string) => {
        const index = selectedIndex ?? ENTRY_FIRST_CELL_INDEX;

        setSelectedIndex(index);
        applyEntry(replaceEntryValue(entry, index, character));
    };

    const handlePasteChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        const cells = readPuzzleEntryCells(value);

        setEntryText(value);
        setIsLinkUnreadable(false);
        onEntryChange();

        if (value.includes(SHARED_LINK_MARKER)) {
            import('../../utils/decode-shared-puzzle.util')
                .then(module => void applyEntry(module.decodeSharedPuzzle(value)))
                .catch(handleUnreadableLink);
        } else if (cells.length === ENTRY_CELL_COUNT) {
            setEntry(cells.join(''));
        }
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
        if (!isSolveDisabled) {
            onSolve(entry);
        }
    };

    const linkNotice = isLinkUnreadable ? <SolverEntryLinkNotice /> : null;
    const cellCountNotice = isEntryTextIncomplete ? <SolverEntryCountNotice cellCount={entryTextCellCount} /> : null;

    return (
        <div className="solver-entry">
            <SolverEntryBoard entry={entry} onEnterValue={handleEnterValue} onSelect={setSelectedIndex} selectedIndex={selectedIndex} />
            <SolverEntryPad onEnterValue={handleEnterValue} />
            <label className="solver-entry__label" htmlFor={ENTRY_INPUT_ID}>
                Or paste an 81-cell puzzle — digits for givens; dots, zeros, dashes, x, * or _ for blanks — or a Suuudokuuu share link.
            </label>
            <textarea
                autoComplete="off"
                className="solver-entry__input"
                id={ENTRY_INPUT_ID}
                onChange={handlePasteChange}
                rows={3}
                spellCheck={false}
                value={entryText}
            />
            {linkNotice}
            {cellCountNotice}
            <div className="solver-entry__actions">
                <button className="solver-entry__solve" disabled={isSolveDisabled} onClick={handleSolve} type="button">
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
