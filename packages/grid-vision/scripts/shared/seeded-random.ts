const MODULUS = 2_147_483_647;
const MULTIPLIER = 48_271;
const CELL_COUNT = 81;
const DIGITS = { minimum: 1, maximum: 9 };

interface RangeInterface {
    readonly minimum: number;
    readonly maximum: number;
}

export class SeededRandom {
    private state: number;

    constructor(seed: number) {
        this.state = (Math.abs(Math.floor(seed)) % (MODULUS - 1)) + 1;
    }

    next(): number {
        this.state = (this.state * MULTIPLIER) % MODULUS;

        return (this.state - 1) / (MODULUS - 1);
    }

    between(range: RangeInterface): number {
        return range.minimum + (range.maximum - range.minimum) * this.next();
    }

    integer(range: RangeInterface): number {
        return Math.floor(this.between({ minimum: range.minimum, maximum: range.maximum + 1 }));
    }

    chance(probability: number): boolean {
        return this.next() < probability;
    }

    pick<T>(items: readonly T[]): T {
        return items[this.integer({ minimum: 0, maximum: items.length - 1 })];
    }

    puzzle(clueProbability: number): string {
        return Array.from({ length: CELL_COUNT }, () => (this.chance(clueProbability) ? this.integer(DIGITS).toString() : '.')).join('');
    }
}
