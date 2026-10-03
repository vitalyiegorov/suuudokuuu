import { makeTestSqlLayer } from '@suuudokuuu/test-kit';
import * as Layer from 'effect/Layer';

import { ProgressLayer } from '../src/@generic/layer/progress.layer';

export const ProgressTestLayer = ProgressLayer.pipe(Layer.provideMerge(makeTestSqlLayer()));
