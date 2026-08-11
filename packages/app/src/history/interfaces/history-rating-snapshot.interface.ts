export interface HistoryRatingSnapshotInterface {
    rating: number;
    isRatingCeiling: boolean;
}

export const emptyHistoryRatingSnapshot: HistoryRatingSnapshotInterface = {
    rating: 0,
    isRatingCeiling: false
};
