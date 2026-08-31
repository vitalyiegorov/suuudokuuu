import { DAILY_SEED_NAMESPACE } from '../../@generic/constants/daily-challenge.constant';

/* eslint-disable no-bitwise -- FNV-1a is defined by its 32-bit offset basis, its prime and unsigned bit mixing */
const FNV_OFFSET_BASIS = 0x811c9dc5;
const FNV_PRIME = 0x0100_0193;

export const getDailyPuzzleSeed = (dateString: string): number => {
    const seedInput = `${DAILY_SEED_NAMESPACE}${dateString}`;
    let hash = FNV_OFFSET_BASIS;

    for (let index = 0; index < seedInput.length; index += 1) {
        hash = Math.imul(hash ^ seedInput.charCodeAt(index), FNV_PRIME) >>> 0;
    }

    return hash >>> 0;
};
/* eslint-enable no-bitwise */
