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

const readNextChunk = async (reader: ResponseBodyReader, textDecoder: TextDecoder, state: BoundedReadState): Promise<BoundedReadResult> => {
    const readResult = await reader.read();
    if (readResult.done) {
        return { status: 'success', text: state.text.concat(textDecoder.decode()) };
    }

    const chunk = readResult.value ?? null;
    if (chunk === null) {
        await cancelReader(reader);

        return { status: 'failure' };
    }

    const nextByteLength = state.byteLength + chunk.byteLength;
    if (nextByteLength > state.maximumByteLength) {
        await cancelReader(reader);

        return { status: 'failure' };
    }

    const nextState = {
        byteLength: nextByteLength,
        maximumByteLength: state.maximumByteLength,
        text: state.text.concat(textDecoder.decode(chunk, { stream: true }))
    };

    return readNextChunk(reader, textDecoder, nextState);
};

export const readBoundedResponseText = async (response: BoundedTextResponse, maximumByteLength: number): Promise<string | null> => {
    if (response.body === null) {
        return null;
    }

    const reader = response.body.getReader();
    try {
        const readResult = await readNextChunk(reader, new TextDecoder('utf-8', { fatal: true }), {
            byteLength: 0,
            maximumByteLength,
            text: ''
        });

        return readResult.status === 'success' ? readResult.text : null;
    } catch {
        await cancelReader(reader);

        return null;
    } finally {
        reader.releaseLock();
    }
};
