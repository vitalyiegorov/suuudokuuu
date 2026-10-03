import * as OpfsWorker from '@effect/sql-sqlite-wasm/OpfsWorker';
import * as Effect from 'effect/Effect';

import { DatabaseFileName } from '../constants/database-file-name.constant';

const workerPort = {
    addEventListener: self.addEventListener.bind(self),
    removeEventListener: self.removeEventListener.bind(self),
    dispatchEvent: self.dispatchEvent.bind(self),
    postMessage: (message: unknown, transferOrOptions?: Transferable[] | StructuredSerializeOptions) => {
        self.postMessage(message, Array.isArray(transferOrOptions) ? { transfer: transferOrOptions } : transferOrOptions);
    },
    close: () => {
        self.close();
    }
};

Effect.runFork(OpfsWorker.run({ port: workerPort, dbName: DatabaseFileName }));
