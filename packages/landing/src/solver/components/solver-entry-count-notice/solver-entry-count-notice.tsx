import { ENTRY_CELL_COUNT } from '../../constants/puzzle-entry.constant';

interface Props {
    cellCount: number;
}

export const SolverEntryCountNotice = ({ cellCount }: Props) => (
    <p className="solver-notice" data-tone="error" role="status">
        That text holds {cellCount} cells, but a sudoku needs exactly {ENTRY_CELL_COUNT}. Each digit 1 to 9 is a given and each ., 0, -, x,
        * or _ is a blank; spaces, line breaks, | and + are ignored. The grid keeps its last complete puzzle until the text adds up to{' '}
        {ENTRY_CELL_COUNT} cells.
    </p>
);
