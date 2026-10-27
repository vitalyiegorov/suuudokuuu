import { emptyFn } from '@rnw-community/shared';

import type { Dispatch, SetStateAction } from 'react';

export const importScreenSubscribeWebInput: (
    onPaste: (text: string) => void,
    onSelectCell: Dispatch<SetStateAction<number | null>>,
    onInput: (value: number) => void
) => () => void = () => emptyFn;
