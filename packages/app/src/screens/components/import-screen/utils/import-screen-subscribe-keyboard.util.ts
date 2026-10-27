import { emptyFn } from '@rnw-community/shared';

export const importScreenSubscribeKeyboard: (
    selectedCellIndex: number | null,
    onSelectCell: (cellIndex: number) => void,
    onInput: (value: number) => void
) => () => void = () => emptyFn;
