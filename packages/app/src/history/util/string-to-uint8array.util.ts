export const stringToUint8Array = (input: string): Uint8Array => {
    const binary = input;

    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
};
