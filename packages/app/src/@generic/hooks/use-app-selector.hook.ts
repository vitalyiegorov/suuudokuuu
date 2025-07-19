import { type TypedUseSelectorHook, useSelector } from 'react-redux';

import type { RootState } from '../app-root.store';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
