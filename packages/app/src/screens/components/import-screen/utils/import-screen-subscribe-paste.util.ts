import { emptyFn } from '@rnw-community/shared';

export const importScreenSubscribePaste: (onText: (text: string) => void) => () => void = () => emptyFn;
