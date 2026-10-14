import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { isDeepStrictEqual } from 'node:util';

import { isDefined } from '@rnw-community/shared';

import { DEFAULT_LOCALE, HREFLANG_DEFAULT_KEY, SUPPORTED_LOCALES } from '../src/seo/constants/site.constant';

const EXPORT_DIRECTORY = join(import.meta.dirname, '..', 'out');

const LinkTagPattern = /<(?:xhtml:)?link\b[^>]*>/gu;

const SitemapEntryPattern = /<url>([\s\S]*?)<\/url>/gu;

const SitemapLocationPattern = /<loc>([^<]+)<\/loc>/u;

const HtmlLangPattern = /<html\b[^>]*\slang="([^"]*)"/u;

const AttributePattern = /\s([\w-]+)="([^"]*)"/gu;

const readLinkAttributes = (markup: string): Record<string, string>[] =>
    Array.from(markup.match(LinkTagPattern) ?? [], tag =>
        Object.fromEntries(Array.from(tag.matchAll(AttributePattern), ([, name = '', value = '']) => [name.toLowerCase(), value]))
    );

const readCluster = (markup: string): Record<string, string> =>
    Object.fromEntries(
        readLinkAttributes(markup).flatMap(({ href, hreflang, rel }) =>
            rel === 'alternate' && isDefined(hreflang) && isDefined(href) ? [[hreflang, new URL(href).href]] : []
        )
    );

const readCanonical = (markup: string): string | undefined => {
    const canonicalHref = readLinkAttributes(markup).find(({ rel }) => rel === 'canonical')?.['href'];

    return isDefined(canonicalHref) ? new URL(canonicalHref).href : undefined;
};

const toExportFile = (url: string): string => {
    const { pathname } = new URL(url);

    return join(EXPORT_DIRECTORY, pathname === '/' ? 'index.html' : `${pathname}.html`);
};

const listHtmlFiles = (directory: string): string[] =>
    readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
        const entryPath = join(directory, entry.name);

        if (entry.isDirectory()) {
            return listHtmlFiles(entryPath);
        }

        return entry.name.endsWith('.html') ? [entryPath] : [];
    });

const pages = listHtmlFiles(EXPORT_DIRECTORY).flatMap(file => {
    const markup = readFileSync(file, 'utf8');
    const canonical = readCanonical(markup);

    return isDefined(canonical) ? [{ canonical, cluster: readCluster(markup), lang: HtmlLangPattern.exec(markup)?.[1] ?? '' }] : [];
});

const pageClusters = new Map(pages.map(({ canonical, cluster }) => [canonical, cluster]));

const sitemapClusters = new Map(
    Array.from(readFileSync(join(EXPORT_DIRECTORY, 'sitemap.xml'), 'utf8').matchAll(SitemapEntryPattern), ([, entry = '']) => [
        new URL(SitemapLocationPattern.exec(entry)?.[1] ?? '').href,
        readCluster(entry)
    ])
);

const checkAlternate = (url: string, cluster: Record<string, string>, alternateUrl: string): string[] => {
    if (!existsSync(toExportFile(alternateUrl))) {
        return [`${url} points to ${alternateUrl}, which the export does not contain`];
    }

    return isDeepStrictEqual(pageClusters.get(alternateUrl), cluster) ? [] : [`${url} and ${alternateUrl} declare different clusters`];
};

const checkPage = ({ canonical: url, cluster, lang }: (typeof pages)[number]): string[] => [
    ...(cluster[lang] === url ? [] : [`${url} is not the hreflang="${lang}" alternate its <html lang> claims`]),
    ...Object.keys(cluster)
        .filter(hreflang => hreflang !== HREFLANG_DEFAULT_KEY && !SUPPORTED_LOCALES.some(locale => locale === hreflang))
        .map(hreflang => `${url} declares hreflang="${hreflang}", which is not a supported locale`),
    ...(isDefined(cluster[HREFLANG_DEFAULT_KEY]) && cluster[HREFLANG_DEFAULT_KEY] === cluster[DEFAULT_LOCALE]
        ? []
        : [`${url} has no ${HREFLANG_DEFAULT_KEY} alternate pointing to its ${DEFAULT_LOCALE} page`]),
    ...(isDeepStrictEqual(sitemapClusters.get(url), cluster) ? [] : [`${url} is missing from sitemap.xml or lists other alternates there`]),
    ...Object.values(cluster).flatMap(alternateUrl => checkAlternate(url, cluster, alternateUrl))
];

const problems = [
    ...pages.flatMap(checkPage),
    ...pages
        .filter(({ canonical }, index) => pages.findIndex(page => page.canonical === canonical) !== index)
        .map(({ canonical }) => `${canonical} is the canonical of more than one exported page`),
    ...Array.from(sitemapClusters.keys())
        .filter(url => !pageClusters.has(url))
        .map(url => `${url} is in sitemap.xml but no exported page declares it canonical`)
];

if (problems.length > 0) {
    throw new Error(problems.join('\n'));
}

process.stdout.write(`hreflang clusters are reciprocal across ${pageClusters.size} pages and match sitemap.xml\n`);
