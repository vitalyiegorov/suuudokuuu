import { createContext } from 'react';

import { emptyFn } from '@rnw-community/shared';

export const WinConfettiContext = createContext<() => void>(emptyFn);
