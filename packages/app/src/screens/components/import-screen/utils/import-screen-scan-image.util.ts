import * as Effect from 'effect/Effect';
import DocumentScanner, { ScanDocumentResponseStatus } from 'react-native-document-scanner-plugin';

export const importScreenScanImage = Effect.tryPromise(() =>
    DocumentScanner.scanDocument({ maxNumDocuments: 1, croppedImageQuality: 90 })
).pipe(
    Effect.map(({ scannedImages, status }) => (status === ScanDocumentResponseStatus.Success ? (scannedImages?.[0] ?? null) : null)),
    Effect.orDie
);
