export interface GameFieldStatePayloadInterface {
    readonly sudokuString: string;
    readonly candidates: Record<string, number[]>;
}
