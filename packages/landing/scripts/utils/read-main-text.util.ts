export const readMainText = (markup: string): string | undefined =>
    /<main\b[^>]*>([\s\S]*?)<\/main>/u
        .exec(markup)?.[1]
        ?.replaceAll(/<!--[\s\S]*?-->/gu, ' ')
        .replaceAll(/<(script|style|svg|noscript)\b[^>]*>[\s\S]*?<\/\1>/giu, ' ')
        .replaceAll(/<[^<>]+>/gu, ' ')
        .replaceAll(/&#?\w+;/gu, ' ')
        .replaceAll(/\s+/gu, ' ')
        .trim();
