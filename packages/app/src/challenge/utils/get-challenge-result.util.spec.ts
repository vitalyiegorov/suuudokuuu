import { describe, expect, it } from '@jest/globals';

import { ChallengeResult } from '../interfaces/challenge-result.interface';

import { getChallengeResult } from './get-challenge-result.util';

const FasterPlayerTime = 300;
const SlowerPlayerTime = 301;

describe('getChallengeResult', () => {
    it('marks a strictly faster player as the winner', () => {
        expect(getChallengeResult(FasterPlayerTime, SlowerPlayerTime)).toBe(ChallengeResult.Won);
    });

    it('marks a strictly slower player as the loser', () => {
        expect(getChallengeResult(SlowerPlayerTime, FasterPlayerTime)).toBe(ChallengeResult.Lost);
    });

    it('marks equal times as a tie', () => {
        expect(getChallengeResult(FasterPlayerTime, FasterPlayerTime)).toBe(ChallengeResult.Tied);
    });
});
