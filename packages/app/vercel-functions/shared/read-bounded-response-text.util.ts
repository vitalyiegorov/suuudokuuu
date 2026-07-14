type BoundedReadResult = { readonly status: 'failure' } | { readonly status: 'success'; readonly text: string };

interface ResponseBodyReadResult {
    readonly done: boolean;
    readonly value?: Uint8Array;
}

interface ResponseBodyReader {
    cancel: () => Promise<void>;
    read: () => Promise<ResponseBodyReadResult>;
    releaseLock: () => void;
}

interface BoundedTextResponse {
    readonly body: { readonly getReader: () => ResponseBodyReader } | null;
    readonly headers: Headers;
}

interface BoundedReadState {
    readonly byteLength: number;
    readonly maximumByteLength: number;
    readonly text: string;
}

const cancelReader = async (reader: ResponseBodyReader) => {
    try {
        await reader.cancel();
    } catch {
        return false;
    }

    return true;
};

const readNextChunk = async (
    reader: ResponseBodyReader,
    textDecoder: TextDecoder,
    state: BoundedReadState,
    signal: AbortSignal
): Promise<BoundedReadResult> => {
    if (signal.aborted) {
        await cancelReader(reader);

        return { status: 'failure' };
    }

    const readResult = await reader.read();
    if (readResult.done) {
        return { status: 'success', text: state.text.concat(textDecoder.decode()) };
    }

    const chunk = readResult.value ?? null;
    const nextByteLength = state.byteLength + (chunk?.byteLength ?? 0);
    if (chunk === null || nextByteLength > state.maximumByteLength) {
        await cancelReader(reader);

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
    response: BoundedTextResponse,
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
        await cancelReader(reader);

        return null;
    } finally {
        reader.releaseLock();
    }
};
