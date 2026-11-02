const LinkTagPattern = /<(?:xhtml:)?link\b[^>]*>/gu;

const AttributePattern = /\s([\w-]+)="([^"]*)"/gu;

export const readLinkAttributes = (markup: string): Record<string, string>[] =>
    Array.from(markup.match(LinkTagPattern) ?? [], tag =>
        Object.fromEntries(Array.from(tag.matchAll(AttributePattern), ([, name = '', value = '']) => [name.toLowerCase(), value]))
    );
