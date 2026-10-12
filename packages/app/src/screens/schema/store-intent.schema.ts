import * as Schema from 'effect/Schema';

import { StoreIntentEnum } from '../enum/store-intent.enum';

export const StoreIntentSchema = Schema.Enum(StoreIntentEnum);
