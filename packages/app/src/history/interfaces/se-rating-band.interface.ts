import type { MessageDescriptor } from '@lingui/core';

export interface SeRatingBandInterface {
    readonly id: string;
    readonly label: string;
    readonly nameMessage: MessageDescriptor;
    readonly minRating: number;
    readonly maxRating: number;
}
