import { ProgressLayer } from '@suuudokuuu/progress';
import * as Layer from 'effect/Layer';
import * as ManagedRuntime from 'effect/ManagedRuntime';
import * as Atom from 'effect/reactivity/Atom';
import * as Reactivity from 'effect/reactivity/Reactivity';

import { PuzzleGenerationService } from '../../game/service/puzzle-generation.service';

import { sqlPlatformLayer } from './sql-platform.layer';

const appMemoMap = Layer.makeMemoMapUnsafe();

const appLayer = ProgressLayer.pipe(
    Layer.provideMerge(sqlPlatformLayer),
    Layer.provideMerge(Reactivity.layer),
    Layer.provideMerge(PuzzleGenerationService.layer)
);

export const appRuntime = ManagedRuntime.make(appLayer, { memoMap: appMemoMap });

export const appAtomRuntime = Atom.context({ memoMap: appMemoMap })(appLayer);

export type AppServices = ManagedRuntime.ManagedRuntime.Services<typeof appRuntime>;
