import { isNotEmptyString } from '@rnw-community/shared';

export const importScreenSubscribePaste = (onText: (text: string) => void) => {
    const handlePaste = (event: ClipboardEvent) => {
        const text = event.clipboardData?.getData('text/plain') ?? '';

        if (event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLInputElement || !isNotEmptyString(text)) {
            return;
        }

        event.preventDefault();
        onText(text);
    };

    document.addEventListener('paste', handlePaste);

    return () => void document.removeEventListener('paste', handlePaste);
};
