import { useSyncExternalStore } from 'react';

import type { FieldEngine } from '../field-engine/classes/field-engine';
import type { FieldSnapshotInterface } from '../field-engine/interfaces/field-snapshot.interface';

export const useFieldSnapshot = (engine: FieldEngine): FieldSnapshotInterface =>
    useSyncExternalStore(engine.subscribe, engine.getSnapshot, engine.getSnapshot);
