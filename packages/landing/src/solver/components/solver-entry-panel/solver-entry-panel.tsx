import { useReducer } from 'react';

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

enum EntryActionType {
    CELL_SELECTED = 'CELL_SELECTED',
    VALUE_ENTERED = 'VALUE_ENTERED',
    TEXT_PASTED = 'TEXT_PASTED',
    PUZZLE_LOADED = 'PUZZLE_LOADED',
    SHARED_PUZZLE_DECODED = 'SHARED_PUZZLE_DECODED',
    SHARED_LINK_UNREADABLE = 'SHARED_LINK_UNREADABLE'
}

interface EntryState {
    readonly entry: string;
    readonly entryText: string;
    readonly selectedIndex: number | null;
    readonly isLinkUnreadable: boolean;
}

type EntryAction =
    | { readonly type: EntryActionType.CELL_SELECTED; readonly index: number }
    | { readonly type: EntryActionType.VALUE_ENTERED; readonly character: string }
    | { readonly type: EntryActionType.TEXT_PASTED; readonly value: string }
    | { readonly type: EntryActionType.PUZZLE_LOADED; readonly entry: string }
    | { readonly type: EntryActionType.SHARED_PUZZLE_DECODED; readonly entry: string }
    | { readonly type: EntryActionType.SHARED_LINK_UNREADABLE };

const INITIAL_ENTRY_STATE: EntryState = {
    entry: EMPTY_PUZZLE_ENTRY,
    entryText: EMPTY_PUZZLE_ENTRY,
    selectedIndex: null,
    isLinkUnreadable: false
};

const entryReducer = (state: EntryState, action: EntryAction): EntryState => {
    switch (action.type) {
        case EntryActionType.CELL_SELECTED: {
            return { ...state, selectedIndex: action.index };
        }
        case EntryActionType.VALUE_ENTERED: {
            const selectedIndex = state.selectedIndex ?? ENTRY_FIRST_CELL_INDEX;
            const entry = replaceEntryValue(state.entry, selectedIndex, action.character);

            return { entry, entryText: entry, selectedIndex, isLinkUnreadable: false };
        }
        case EntryActionType.TEXT_PASTED: {
            const cells = readPuzzleEntryCells(action.value);
            const isPlainFullPuzzle = !action.value.includes(SHARED_LINK_MARKER) && cells.length === ENTRY_CELL_COUNT;

            return {
                ...state,
                entry: isPlainFullPuzzle ? cells.join('') : state.entry,
                entryText: action.value,
                isLinkUnreadable: false
            };
        }
        case EntryActionType.PUZZLE_LOADED: {
            return { entry: action.entry, entryText: action.entry, selectedIndex: null, isLinkUnreadable: false };
        }
        case EntryActionType.SHARED_PUZZLE_DECODED: {
            return { ...state, entry: action.entry, entryText: action.entry, isLinkUnreadable: false };
        }
        case EntryActionType.SHARED_LINK_UNREADABLE: {
            return { ...state, isLinkUnreadable: true };
        }
        default: {
            return state;
        }
    }
};

interface Props {
    isSolving: boolean;
    onSolve: (entry: string) => void;
    onEntryChange: () => void;
}

export const SolverEntryPanel = ({ isSolving, onEntryChange, onSolve }: Props) => {
    const [{ entry, entryText, selectedIndex, isLinkUnreadable }, dispatch] = useReducer(entryReducer, INITIAL_ENTRY_STATE);
    const solveLabel = isSolving ? 'Solving…' : 'Solve step by step';
    const entryTextCellCount = readPuzzleEntryCells(entryText).length;
    const isEntryTextIncomplete = !entryText.includes(SHARED_LINK_MARKER) && entryTextCellCount !== ENTRY_CELL_COUNT;
    const isSolveDisabled = isSolving || isEntryTextIncomplete;

    const handleSelectCell = (index: number) => {
        dispatch({ type: EntryActionType.CELL_SELECTED, index });
    };

    const handleEnterValue = (character: string) => {
        dispatch({ type: EntryActionType.VALUE_ENTERED, character });
        onEntryChange();
    };

    const applySharedEntry = (sharedEntry: string) => {
        dispatch({ type: EntryActionType.SHARED_PUZZLE_DECODED, entry: sharedEntry });
        onEntryChange();
    };

    const handleUnreadableLink = () => {
        dispatch({ type: EntryActionType.SHARED_LINK_UNREADABLE });
    };

    const handlePasteChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;

        dispatch({ type: EntryActionType.TEXT_PASTED, value });
        onEntryChange();

        if (value.includes(SHARED_LINK_MARKER)) {
            import('../../utils/decode-shared-puzzle.util')
                .then(module => void applySharedEntry(module.decodeSharedPuzzle(value)))
                .catch(handleUnreadableLink);
        }
    };

    const handleLoadSample = () => {
        dispatch({ type: EntryActionType.PUZZLE_LOADED, entry: SAMPLE_PUZZLE_ENTRY });
        onEntryChange();
    };

    const handleClear = () => {
        dispatch({ type: EntryActionType.PUZZLE_LOADED, entry: EMPTY_PUZZLE_ENTRY });
        onEntryChange();
    };

    const handleSolve = () => {
        onSolve(entry);
    };

    const linkNotice = isLinkUnreadable ? <SolverEntryLinkNotice /> : null;
    const cellCountNotice = isEntryTextIncomplete ? <SolverEntryCountNotice cellCount={entryTextCellCount} /> : null;

    return (
        <div className="solver-entry">
            <SolverEntryBoard entry={entry} onEnterValue={handleEnterValue} onSelect={handleSelectCell} selectedIndex={selectedIndex} />
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
