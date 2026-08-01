export interface ConfettiParticleInterface {
    readonly id: number;
    readonly leftRatio: number;
    readonly size: number;
    readonly aspectRatio: number;
    readonly color: string;
    readonly durationMilliseconds: number;
    readonly delayMilliseconds: number;
    readonly horizontalDrift: number;
    readonly swayAmplitude: number;
    readonly spinDegrees: number;
    readonly flipDegrees: number;
}
