export const SE_CHAIN_RATING_MINIMUM = 6.6;
export const SE_CHAIN_RATING_MAXIMUM = 7.6;
export const SE_CHAIN_LENGTH_INCREMENT = 0.1;
export const SE_RATING_DECIMAL_SCALE = 10;

const SE_CHAIN_LENGTH_FIRST_THRESHOLD = 4;
const SE_CHAIN_LENGTH_GROWTH_FACTORS = [4 / 3, 3 / 2];

const createChainLengthThresholds = (): number[] => {
    const thresholdCount = Math.round((SE_CHAIN_RATING_MAXIMUM - SE_CHAIN_RATING_MINIMUM) / SE_CHAIN_LENGTH_INCREMENT);
    const thresholds: number[] = [];
    let threshold = SE_CHAIN_LENGTH_FIRST_THRESHOLD;

    while (thresholds.length < thresholdCount) {
        thresholds.push(threshold);
        threshold = Math.round(threshold * SE_CHAIN_LENGTH_GROWTH_FACTORS[thresholds.length % SE_CHAIN_LENGTH_GROWTH_FACTORS.length]);
    }

    return thresholds;
};

export const SE_CHAIN_LENGTH_THRESHOLDS = createChainLengthThresholds();
