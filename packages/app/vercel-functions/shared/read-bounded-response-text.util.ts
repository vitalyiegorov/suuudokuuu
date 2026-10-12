import { cancelResponseBody } from './cancel-response-body.util.js';

import type { ReadableStreamDefaultReader } from 'node:stream/web';

type BoundedReadResult = { readonly status: 'failure' } | { readonly status: 'success'; readonly text: string };

interface BoundedReadState {
    readonly byteLength: number;
    readonly maximumByteLength: number;
    readonly text: string;
}

const readNextChunk = async (
    reader: ReadableStreamDefaultReader<Uint8Array>,
    textDecoder: TextDecoder,
    state: BoundedReadState,
    signal: AbortSignal
): Promise<BoundedReadResult> => {
    if (signal.aborted) {
        await cancelResponseBody(reader);

        return { status: 'failure' };
    }

    const readResult = await reader.read();
    if (readResult.done) {
        return { status: 'success', text: state.text.concat(textDecoder.decode()) };
    }

    const chunk = readResult.value;
    const nextByteLength = state.byteLength + chunk.byteLength;
    if (nextByteLength > state.maximumByteLength) {
        await cancelResponseBody(reader);

        return { status: 'failure' };
    }

    const nextState = {
        byteLength: nextByteLength,
        maximumByteLength: state.maximumByteLength,
        text: state.text.concat(textDecoder.decode(chunk, { stream: true }))
    };

    return readNextChunk(reader, textDecoder, nextState, signal);
};

export const readBoundedResponseText = async (
    response: Pick<Response, 'body'>,
    maximumByteLength: number,
    signal: AbortSignal
): Promise<string | null> => {
    if (response.body === null) {
        return null;
    }

    const reader = response.body.getReader();
    try {
        const readResult = await readNextChunk(
            reader,
            new TextDecoder('utf-8', { fatal: true }),
            {
                byteLength: 0,
                maximumByteLength,
                text: ''
            },
            signal
        );

        return readResult.status === 'success' ? readResult.text : null;
    } catch {
        await cancelResponseBody(reader);

        return null;
    } finally {
        reader.releaseLock();
    }
};
