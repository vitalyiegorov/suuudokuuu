export {};

declare global {
    interface Array<T> {
        findLast<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: unknown): S | undefined;
        findLast(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: unknown): T | undefined;
        findLastIndex(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: unknown): number;
        toReversed(): T[];
        toSpliced(start: number, deleteCount?: number, ...items: T[]): T[];
        with(index: number, value: T): T[];
    }

    interface ReadonlyArray<T> {
        findLast<S extends T>(predicate: (value: T, index: number, array: readonly T[]) => value is S, thisArg?: unknown): S | undefined;
        findLast(predicate: (value: T, index: number, array: readonly T[]) => unknown, thisArg?: unknown): T | undefined;
        findLastIndex(predicate: (value: T, index: number, array: readonly T[]) => unknown, thisArg?: unknown): number;
        toReversed(): T[];
        toSpliced(start: number, deleteCount?: number, ...items: T[]): T[];
        with(index: number, value: T): T[];
    }
}
