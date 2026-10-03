import { ProgressLayer } from '@suuudokuuu/progress';
import * as Layer from 'effect/Layer';
import * as ManagedRuntime from 'effect/ManagedRuntime';
import * as Atom from 'effect/reactivity/Atom';
import * as Reactivity from 'effect/reactivity/Reactivity';

import { sqlPlatformLayer } from './sql-platform.layer';

const appMemoMap = Layer.makeMemoMapUnsafe();

const platformLayer = sqlPlatformLayer.pipe(Layer.provideMerge(Reactivity.layer));

const appLayer = ProgressLayer.pipe(Layer.provideMerge(platformLayer));

export const appRuntime = ManagedRuntime.make(appLayer, { memoMap: appMemoMap });

export const appAtomRuntime = Atom.context({ memoMap: appMemoMap })(appLayer);

export type AppServices = ManagedRuntime.ManagedRuntime.Services<typeof appRuntime>;
