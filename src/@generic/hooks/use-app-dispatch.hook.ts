import { useDispatch } from 'react-redux';

import type { AppDispatch } from '../../@app-root/store/app-root.store';

export const useAppDispatch: () => AppDispatch = useDispatch;
