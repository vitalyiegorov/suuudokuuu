const HexColorPrefix = '#';
const ShortHexLength = 3;
const HexRadix = 16;
const RedHexStart = 0;
const GreenHexStart = 2;
const BlueHexStart = 4;
const HexChannelLength = 2;
const ChannelCount = 3;

export const applyColorAlpha = (color: string, alpha: number): string => {
    if (!color.startsWith(HexColorPrefix)) {
        const channels = color
            .replace(/rgba?\(/u, '')
            .replace(/\)/u, '')
            .split(',')
            .slice(0, ChannelCount)
            .map(channel => channel.trim());

        return `rgba(${channels.join(', ')}, ${alpha})`;
    }

    const hex = color.slice(HexColorPrefix.length);
    const normalizedHex =
        hex.length === ShortHexLength
            ? hex
                  .split('')
                  .map(character => character.repeat(HexChannelLength))
                  .join('')
            : hex;
    const red = parseInt(normalizedHex.slice(RedHexStart, RedHexStart + HexChannelLength), HexRadix);
    const green = parseInt(normalizedHex.slice(GreenHexStart, GreenHexStart + HexChannelLength), HexRadix);
    const blue = parseInt(normalizedHex.slice(BlueHexStart, BlueHexStart + HexChannelLength), HexRadix);

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};
