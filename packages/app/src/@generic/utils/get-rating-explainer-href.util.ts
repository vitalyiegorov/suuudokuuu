const RatingDecimalPlaces = 1;
const CeilingParamValue = '1';
const NotCeilingParamValue = '0';

export const getRatingExplainerHref = (rating: number, isCeiling: boolean) => ({
    pathname: '/rating-explainer/[rating]' as const,
    params: {
        rating: rating.toFixed(RatingDecimalPlaces),
        isCeiling: isCeiling ? CeilingParamValue : NotCeilingParamValue
    }
});
