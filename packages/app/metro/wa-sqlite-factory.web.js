import './install-import-meta-registry.web';

import waSqliteFactory from '@effect/wa-sqlite/dist/wa-sqlite.mjs';
import waSqliteWasmUrl from '@effect/wa-sqlite/dist/wa-sqlite.wasm';

export default function createWaSqliteModule(moduleArgument = {}) {
    return waSqliteFactory({ ...moduleArgument, locateFile: () => waSqliteWasmUrl });
}
