import { useAtomValue } from '@effect/atom-react/Hooks';
import * as AsyncResult from 'effect/reactivity/AsyncResult';

import { settingsAtom } from '../atoms/settings.atom';
import { getDefaultSettings } from '../utils/get-default-settings.util';

export const useSettings = () => AsyncResult.getOrElse(useAtomValue(settingsAtom), getDefaultSettings);
