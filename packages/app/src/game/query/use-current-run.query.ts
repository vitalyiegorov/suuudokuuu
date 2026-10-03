import { useAtomValue } from '@effect/atom-react/Hooks';
import { initialCurrentRun } from '@suuudokuuu/progress';
import * as AsyncResult from 'effect/reactivity/AsyncResult';

import { currentRunAtom } from '../atoms/current-run.atom';

export const useCurrentRun = () => AsyncResult.getOrElse(useAtomValue(currentRunAtom), () => initialCurrentRun);
