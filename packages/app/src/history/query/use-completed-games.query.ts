import * as AsyncResult from 'effect/reactivity/AsyncResult';

import { useLiveAtomValue } from '../../@generic/hooks/use-live-atom-value.hook';
import { completedGamesAtom } from '../atoms/completed-games.atom';

export const useCompletedGames = () => AsyncResult.getOrElse(useLiveAtomValue(completedGamesAtom), () => []);
