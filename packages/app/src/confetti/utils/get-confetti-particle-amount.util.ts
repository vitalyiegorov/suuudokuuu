import {
    winConfettiBaseParticleAmountConstant,
    winConfettiMaxParticleAmountConstant,
    winConfettiMinParticleAmountConstant,
    winConfettiReferenceScreenAreaConstant
} from '../constants/win-confetti.constant';

export const getConfettiParticleAmount = (screenWidth: number, screenHeight: number): number => {
    const areaScale = Math.sqrt((screenWidth * screenHeight) / winConfettiReferenceScreenAreaConstant);
    const scaledAmount = Math.round(winConfettiBaseParticleAmountConstant * areaScale);

    return Math.min(winConfettiMaxParticleAmountConstant, Math.max(winConfettiMinParticleAmountConstant, scaledAmount));
};
