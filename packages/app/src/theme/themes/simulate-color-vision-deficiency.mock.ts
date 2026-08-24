import { ColorVisionDeficiencyEnum } from '../enum/color-vision-deficiency.enum';

import { delinearizeSrgbChannel, linearizeSrgbChannel } from './srgb-channel.util';

import type { ParsedColorInterface } from './parse-color.util';

interface ChannelMixInterface {
    readonly fromRed: number;
    readonly fromGreen: number;
    readonly fromBlue: number;
}

interface DeficiencyMixInterface {
    readonly red: ChannelMixInterface;
    readonly green: ChannelMixInterface;
    readonly blue: ChannelMixInterface;
}

const ProtanopiaRedFromRed = 0.152286;
const ProtanopiaRedFromGreen = 1.052583;
const ProtanopiaRedFromBlue = -0.204868;
const ProtanopiaGreenFromRed = 0.114503;
const ProtanopiaGreenFromGreen = 0.786281;
const ProtanopiaGreenFromBlue = 0.099216;
const ProtanopiaBlueFromRed = -0.003882;
const ProtanopiaBlueFromGreen = -0.048116;
const ProtanopiaBlueFromBlue = 1.051998;

const DeuteranopiaRedFromRed = 0.367322;
const DeuteranopiaRedFromGreen = 0.860646;
const DeuteranopiaRedFromBlue = -0.227968;
const DeuteranopiaGreenFromRed = 0.280085;
const DeuteranopiaGreenFromGreen = 0.672501;
const DeuteranopiaGreenFromBlue = 0.047413;
const DeuteranopiaBlueFromRed = -0.01182;
const DeuteranopiaBlueFromGreen = 0.04294;
const DeuteranopiaBlueFromBlue = 0.968881;

const TritanopiaRedFromRed = 1.255528;
const TritanopiaRedFromGreen = -0.076749;
const TritanopiaRedFromBlue = -0.178779;
const TritanopiaGreenFromRed = -0.078411;
const TritanopiaGreenFromGreen = 0.930809;
const TritanopiaGreenFromBlue = 0.147602;
const TritanopiaBlueFromRed = 0.004733;
const TritanopiaBlueFromGreen = 0.691367;
const TritanopiaBlueFromBlue = 0.3039;

const DeficiencyMixes: Record<ColorVisionDeficiencyEnum, DeficiencyMixInterface> = {
    [ColorVisionDeficiencyEnum.Protanopia]: {
        red: { fromRed: ProtanopiaRedFromRed, fromGreen: ProtanopiaRedFromGreen, fromBlue: ProtanopiaRedFromBlue },
        green: { fromRed: ProtanopiaGreenFromRed, fromGreen: ProtanopiaGreenFromGreen, fromBlue: ProtanopiaGreenFromBlue },
        blue: { fromRed: ProtanopiaBlueFromRed, fromGreen: ProtanopiaBlueFromGreen, fromBlue: ProtanopiaBlueFromBlue }
    },
    [ColorVisionDeficiencyEnum.Deuteranopia]: {
        red: { fromRed: DeuteranopiaRedFromRed, fromGreen: DeuteranopiaRedFromGreen, fromBlue: DeuteranopiaRedFromBlue },
        green: { fromRed: DeuteranopiaGreenFromRed, fromGreen: DeuteranopiaGreenFromGreen, fromBlue: DeuteranopiaGreenFromBlue },
        blue: { fromRed: DeuteranopiaBlueFromRed, fromGreen: DeuteranopiaBlueFromGreen, fromBlue: DeuteranopiaBlueFromBlue }
    },
    [ColorVisionDeficiencyEnum.Tritanopia]: {
        red: { fromRed: TritanopiaRedFromRed, fromGreen: TritanopiaRedFromGreen, fromBlue: TritanopiaRedFromBlue },
        green: { fromRed: TritanopiaGreenFromRed, fromGreen: TritanopiaGreenFromGreen, fromBlue: TritanopiaGreenFromBlue },
        blue: { fromRed: TritanopiaBlueFromRed, fromGreen: TritanopiaBlueFromGreen, fromBlue: TritanopiaBlueFromBlue }
    }
};

export const simulateColorVisionDeficiency = (color: ParsedColorInterface, deficiency: ColorVisionDeficiencyEnum): ParsedColorInterface => {
    const mix = DeficiencyMixes[deficiency];
    const linearRed = linearizeSrgbChannel(color.red);
    const linearGreen = linearizeSrgbChannel(color.green);
    const linearBlue = linearizeSrgbChannel(color.blue);
    const mixChannel = (channelMix: ChannelMixInterface) =>
        channelMix.fromRed * linearRed + channelMix.fromGreen * linearGreen + channelMix.fromBlue * linearBlue;

    return {
        red: delinearizeSrgbChannel(mixChannel(mix.red)),
        green: delinearizeSrgbChannel(mixChannel(mix.green)),
        blue: delinearizeSrgbChannel(mixChannel(mix.blue)),
        alpha: color.alpha
    };
};
