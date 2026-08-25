import { createSign } from 'node:crypto';
import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { getErrorMessage, isDefined, isNotEmptyString, isNumber, isString } from '@rnw-community/shared';

import { SITE_ORIGIN } from '../src/seo/constants/site.constant';

const SERVICE_ACCOUNT_ENVIRONMENT_VARIABLE = 'GCP_SA_KEY';
const CRUX_API_KEY_ENVIRONMENT_VARIABLE = 'CRUX_API_KEY';
const STEP_SUMMARY_ENVIRONMENT_VARIABLE = 'GITHUB_STEP_SUMMARY';

const GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const GOOGLE_JWT_GRANT_TYPE = 'urn:ietf:params:oauth:grant-type:jwt-bearer';
const SEARCH_CONSOLE_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const SEARCH_CONSOLE_API_ORIGIN = 'https://www.googleapis.com/webmasters/v3';
const CRUX_ENDPOINT = 'https://chromeuxreport.googleapis.com/v1/records:queryRecord';

const TOKEN_LIFETIME_SECONDS = 3600;
const MILLISECONDS_PER_DAY = 86_400_000;
const WINDOW_DAYS = 28;
const DATA_LAG_DAYS = 3;
const TOP_ROW_LIMIT = 20;
const PERCENT_SCALE = 100;

const SEARCH_CONSOLE_PROPERTY = `${SITE_ORIGIN}/`;
const REPORT_DIRECTORY = join(__dirname, '..', '..', '..', 'reports', 'seo');

const CRUX_METRICS = [
    { key: 'largest_contentful_paint', label: 'LCP (ms)' },
    { key: 'cumulative_layout_shift', label: 'CLS' },
    { key: 'interaction_to_next_paint', label: 'INP (ms)' }
] as const;

interface ServiceAccountInterface {
    clientEmail: string;
    privateKey: string;
}

interface DateRangeInterface {
    start: string;
    end: string;
}

interface SearchTotalsInterface {
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
}

interface SearchWindowInterface {
    range: DateRangeInterface;
    totals: SearchTotalsInterface;
}

interface SearchRowInterface extends SearchTotalsInterface {
    key: string;
}

interface SitemapStatusInterface {
    path: string;
    lastSubmitted: string;
    lastDownloaded: string;
    isPending: boolean;
    warnings: number;
    errors: number;
    submitted: number;
    indexed: number;
}

interface SearchConsoleReportInterface {
    property: string;
    current: SearchWindowInterface;
    previous: SearchWindowInterface;
    topQueries: SearchRowInterface[];
    topPages: SearchRowInterface[];
    sitemaps: SitemapStatusInterface[];
}

interface WebVitalInterface {
    metric: string;
    p75: number;
    good: number;
    needsImprovement: number;
    poor: number;
}

interface CoreWebVitalsReportInterface {
    origin: string;
    metrics: WebVitalInterface[];
}

interface SeoReportInterface {
    generatedAt: string;
    origin: string;
    searchConsole: SearchConsoleReportInterface | null;
    coreWebVitals: CoreWebVitalsReportInterface | null;
}

const log = (message: string): void => {
    console.log(`[seo-report] ${message}`);
};

const isJsonRecord = (value: unknown): value is Record<string, unknown> =>
    isDefined(value) && typeof value === 'object' && !Array.isArray(value);

const readRecord = (value: unknown, label: string): Record<string, unknown> => {
    if (!isJsonRecord(value)) {
        throw new Error(`${label} is not a JSON object.`);
    }

    return value;
};

const readRequiredString = (source: Record<string, unknown>, key: string, label: string): string => {
    const value = source[key];

    if (!isNotEmptyString(value)) {
        throw new Error(`${label} is missing the "${key}" string field.`);
    }

    return value;
};

const readString = (value: unknown): string => (isString(value) ? value : '');

const readNumber = (value: unknown): number => {
    const parsed = isNumber(value) ? value : Number(readString(value));

    return Number.isFinite(parsed) ? parsed : 0;
};

const readArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

const readJsonResponse = async (response: Response, label: string): Promise<unknown> => {
    const body = await response.text();

    try {
        return JSON.parse(body);
    } catch {
        throw new Error(`${label} responded ${response.status} with a non-JSON body.`);
    }
};

const shiftDate = (date: Date, days: number): Date => new Date(date.getTime() + days * MILLISECONDS_PER_DAY);

const toIsoDay = (date: Date): string => date.toISOString().slice(0, 10);

const buildDateRange = (endDate: Date): DateRangeInterface => ({
    start: toIsoDay(shiftDate(endDate, 1 - WINDOW_DAYS)),
    end: toIsoDay(endDate)
});

const toBase64Url = (value: string): string => Buffer.from(value).toString('base64url');

const parseServiceAccount = (rawKey: string): ServiceAccountInterface => {
    let parsed: unknown = null;

    try {
        parsed = JSON.parse(rawKey);
    } catch {
        throw new Error(
            `${SERVICE_ACCOUNT_ENVIRONMENT_VARIABLE} is not valid JSON. Store the whole service-account key file as the secret.`
        );
    }

    const record = readRecord(parsed, SERVICE_ACCOUNT_ENVIRONMENT_VARIABLE);

    return {
        clientEmail: readRequiredString(record, 'client_email', SERVICE_ACCOUNT_ENVIRONMENT_VARIABLE),
        privateKey: readRequiredString(record, 'private_key', SERVICE_ACCOUNT_ENVIRONMENT_VARIABLE).replaceAll('\\n', '\n')
    };
};

const signServiceAccountJwt = ({ clientEmail, privateKey }: ServiceAccountInterface): string => {
    const issuedAt = Math.floor(Date.now() / 1000);
    const header = toBase64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const claims = toBase64Url(
        JSON.stringify({
            iss: clientEmail,
            scope: SEARCH_CONSOLE_SCOPE,
            aud: GOOGLE_TOKEN_ENDPOINT,
            iat: issuedAt,
            exp: issuedAt + TOKEN_LIFETIME_SECONDS
        })
    );
    const signer = createSign('RSA-SHA256');

    signer.update(`${header}.${claims}`);
    signer.end();

    try {
        return `${header}.${claims}.${signer.sign(privateKey).toString('base64url')}`;
    } catch (error) {
        throw new Error(`${SERVICE_ACCOUNT_ENVIRONMENT_VARIABLE} does not hold a usable RSA private key: ${getErrorMessage(error)}`);
    }
};

const requestAccessToken = async (serviceAccount: ServiceAccountInterface): Promise<string> => {
    const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ grant_type: GOOGLE_JWT_GRANT_TYPE, assertion: signServiceAccountJwt(serviceAccount) })
    });
    const payload = readRecord(await readJsonResponse(response, 'The Google token endpoint'), 'The Google token response');

    if (!response.ok) {
        const description = readString(payload['error_description']);
        const reason = isNotEmptyString(description) ? description : readString(payload['error']);

        throw new Error(`The Google token endpoint responded ${response.status}: ${reason}`);
    }

    return readRequiredString(payload, 'access_token', 'The Google token response');
};

const requestSearchConsole = async (
    accessToken: string,
    path: string,
    body?: Record<string, unknown>
): Promise<Record<string, unknown>> => {
    const url = `${SEARCH_CONSOLE_API_ORIGIN}/sites/${encodeURIComponent(SEARCH_CONSOLE_PROPERTY)}${path}`;
    const response = await fetch(url, {
        method: isDefined(body) ? 'POST' : 'GET',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        ...(isDefined(body) && { body: JSON.stringify(body) })
    });
    const payload = readRecord(await readJsonResponse(response, `Search Console ${path}`), `The Search Console ${path} response`);

    if (!response.ok) {
        const errorDetails = readRecord(payload['error'] ?? {}, `The Search Console ${path} error`);

        throw new Error(
            `Search Console ${path} responded ${response.status}: ${readString(errorDetails['message'])}. Confirm the service account has access to ${SEARCH_CONSOLE_PROPERTY}.`
        );
    }

    return payload;
};

const toSearchTotals = (row: Record<string, unknown>): SearchTotalsInterface => ({
    clicks: readNumber(row['clicks']),
    impressions: readNumber(row['impressions']),
    ctr: readNumber(row['ctr']),
    position: readNumber(row['position'])
});

const querySearchTotals = async (accessToken: string, range: DateRangeInterface): Promise<SearchWindowInterface> => {
    const payload = await requestSearchConsole(accessToken, '/searchAnalytics/query', { startDate: range.start, endDate: range.end });
    const firstRow = readArray(payload['rows'])[0];

    return { range, totals: toSearchTotals(isJsonRecord(firstRow) ? firstRow : {}) };
};

const querySearchRows = async (accessToken: string, range: DateRangeInterface, dimension: string): Promise<SearchRowInterface[]> => {
    const payload = await requestSearchConsole(accessToken, '/searchAnalytics/query', {
        startDate: range.start,
        endDate: range.end,
        dimensions: [dimension],
        rowLimit: TOP_ROW_LIMIT
    });

    return readArray(payload['rows'])
        .filter(isJsonRecord)
        .map(row => ({ key: readString(readArray(row['keys'])[0]), ...toSearchTotals(row) }));
};

const querySitemaps = async (accessToken: string): Promise<SitemapStatusInterface[]> => {
    const payload = await requestSearchConsole(accessToken, '/sitemaps');

    return readArray(payload['sitemap'])
        .filter(isJsonRecord)
        .map(entry => {
            const contents = readArray(entry['contents']).filter(isJsonRecord);

            return {
                path: readString(entry['path']),
                lastSubmitted: readString(entry['lastSubmitted']),
                lastDownloaded: readString(entry['lastDownloaded']),
                isPending: entry['isPending'] === true,
                warnings: readNumber(entry['warnings']),
                errors: readNumber(entry['errors']),
                submitted: contents.reduce((total, content) => total + readNumber(content['submitted']), 0),
                indexed: contents.reduce((total, content) => total + readNumber(content['indexed']), 0)
            };
        });
};

const collectSearchConsole = async (rawKey: string): Promise<SearchConsoleReportInterface> => {
    const accessToken = await requestAccessToken(parseServiceAccount(rawKey));
    const currentRange = buildDateRange(shiftDate(new Date(), -DATA_LAG_DAYS));
    const previousRange = buildDateRange(shiftDate(new Date(currentRange.start), -1));

    return {
        property: SEARCH_CONSOLE_PROPERTY,
        current: await querySearchTotals(accessToken, currentRange),
        previous: await querySearchTotals(accessToken, previousRange),
        topQueries: await querySearchRows(accessToken, currentRange, 'query'),
        topPages: await querySearchRows(accessToken, currentRange, 'page'),
        sitemaps: await querySitemaps(accessToken)
    };
};

const toWebVital = (metrics: Record<string, unknown>, key: string, label: string): WebVitalInterface => {
    const metric = readRecord(metrics[key] ?? {}, `The CrUX ${key} metric`);
    const histogram = readArray(metric['histogram']).filter(isJsonRecord);
    const percentiles = readRecord(metric['percentiles'] ?? {}, `The CrUX ${key} percentiles`);
    const readDensity = (index: number): number => {
        const bucket = histogram.at(index);

        return isDefined(bucket) ? readNumber(bucket['density']) : 0;
    };

    return {
        metric: label,
        p75: readNumber(percentiles['p75']),
        good: readDensity(0),
        needsImprovement: readDensity(1),
        poor: readDensity(2)
    };
};

const collectCoreWebVitals = async (apiKey: string): Promise<CoreWebVitalsReportInterface> => {
    const response = await fetch(`${CRUX_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin: SITE_ORIGIN })
    });
    const payload = readRecord(await readJsonResponse(response, 'The CrUX API'), 'The CrUX response');

    if (!response.ok) {
        const errorDetails = readRecord(payload['error'] ?? {}, 'The CrUX error');

        throw new Error(`The CrUX API responded ${response.status}: ${readString(errorDetails['message'])}`);
    }

    const record = readRecord(payload['record'] ?? {}, 'The CrUX record');
    const metrics = readRecord(record['metrics'] ?? {}, 'The CrUX metrics');

    return { origin: SITE_ORIGIN, metrics: CRUX_METRICS.map(({ key, label }) => toWebVital(metrics, key, label)) };
};

const formatCount = (value: number): string => value.toLocaleString('en-US');

const formatPercent = (value: number): string => `${(value * PERCENT_SCALE).toFixed(2)}%`;

const formatPosition = (value: number): string => value.toFixed(1);

const formatChange = (current: number, previous: number, format: (value: number) => string): string => {
    const difference = current - previous;
    const sign = difference < 0 ? '' : '+';
    const relative = previous === 0 ? '' : ` (${sign}${((difference / previous) * PERCENT_SCALE).toFixed(1)}%)`;

    return `${sign}${format(difference)}${relative}`;
};

const buildTable = (headers: string[], rows: string[][]): string =>
    [`| ${headers.join(' | ')} |`, `| ${headers.map(() => '---').join(' | ')} |`, ...rows.map(row => `| ${row.join(' | ')} |`)].join('\n');

const buildSearchConsoleMarkdown = (report: SearchConsoleReportInterface): string => {
    const { current, previous } = report;
    const totalsTable = buildTable(
        ['Metric', 'Last 28 days', 'Prior 28 days', 'Change'],
        [
            [
                'Clicks',
                formatCount(current.totals.clicks),
                formatCount(previous.totals.clicks),
                formatChange(current.totals.clicks, previous.totals.clicks, formatCount)
            ],
            [
                'Impressions',
                formatCount(current.totals.impressions),
                formatCount(previous.totals.impressions),
                formatChange(current.totals.impressions, previous.totals.impressions, formatCount)
            ],
            [
                'CTR',
                formatPercent(current.totals.ctr),
                formatPercent(previous.totals.ctr),
                formatChange(current.totals.ctr, previous.totals.ctr, formatPercent)
            ],
            [
                'Average position',
                formatPosition(current.totals.position),
                formatPosition(previous.totals.position),
                formatChange(current.totals.position, previous.totals.position, formatPosition)
            ]
        ]
    );
    const rowsTable = (label: string, rows: SearchRowInterface[]): string =>
        buildTable(
            [label, 'Clicks', 'Impressions', 'CTR', 'Position'],
            rows.map(row => [
                row.key,
                formatCount(row.clicks),
                formatCount(row.impressions),
                formatPercent(row.ctr),
                formatPosition(row.position)
            ])
        );
    const sitemapTable = buildTable(
        ['Sitemap', 'Last downloaded', 'Submitted', 'Indexed', 'Errors', 'Warnings'],
        report.sitemaps.map(sitemap => [
            sitemap.path,
            sitemap.lastDownloaded,
            formatCount(sitemap.submitted),
            formatCount(sitemap.indexed),
            formatCount(sitemap.errors),
            formatCount(sitemap.warnings)
        ])
    );

    return [
        `### Search Console — ${report.property}`,
        `${current.range.start} → ${current.range.end} against ${previous.range.start} → ${previous.range.end}`,
        totalsTable,
        `### Top ${TOP_ROW_LIMIT} queries`,
        rowsTable('Query', report.topQueries),
        `### Top ${TOP_ROW_LIMIT} pages`,
        rowsTable('Page', report.topPages),
        '### Sitemaps',
        sitemapTable
    ].join('\n\n');
};

const buildCoreWebVitalsMarkdown = (report: CoreWebVitalsReportInterface): string =>
    [
        `### Core Web Vitals — CrUX field data for ${report.origin}`,
        buildTable(
            ['Metric', 'p75', 'Good', 'Needs improvement', 'Poor'],
            report.metrics.map(metric => [
                metric.metric,
                formatCount(metric.p75),
                formatPercent(metric.good),
                formatPercent(metric.needsImprovement),
                formatPercent(metric.poor)
            ])
        )
    ].join('\n\n');

const buildMarkdown = (report: SeoReportInterface, reportPath: string): string => {
    const sections = [
        `## SEO report — ${toIsoDay(new Date(report.generatedAt))}`,
        ...(isDefined(report.searchConsole) ? [buildSearchConsoleMarkdown(report.searchConsole)] : []),
        ...(isDefined(report.coreWebVitals) ? [buildCoreWebVitalsMarkdown(report.coreWebVitals)] : []),
        `Raw snapshot: \`${reportPath}\``
    ];

    return `${sections.join('\n\n')}\n`;
};

const publishMarkdown = (markdown: string): void => {
    const summaryPath = process.env[STEP_SUMMARY_ENVIRONMENT_VARIABLE];

    if (isNotEmptyString(summaryPath)) {
        appendFileSync(summaryPath, markdown);
        log(`Appended the report to ${STEP_SUMMARY_ENVIRONMENT_VARIABLE}.`);
    } else {
        console.log(markdown);
    }
};

const writeReport = (report: SeoReportInterface): string => {
    const reportPath = join(REPORT_DIRECTORY, `${toIsoDay(new Date(report.generatedAt))}.json`);

    mkdirSync(REPORT_DIRECTORY, { recursive: true });
    writeFileSync(reportPath, `${JSON.stringify(report, null, 4)}\n`);

    return reportPath;
};

const generateReport = async (): Promise<void> => {
    const serviceAccountKey = process.env[SERVICE_ACCOUNT_ENVIRONMENT_VARIABLE];
    const cruxApiKey = process.env[CRUX_API_KEY_ENVIRONMENT_VARIABLE];

    if (!isNotEmptyString(serviceAccountKey)) {
        log(
            `${SERVICE_ACCOUNT_ENVIRONMENT_VARIABLE} is not set, skipping the Search Console section. See packages/landing/docs/indexing.md.`
        );
    }

    if (!isNotEmptyString(cruxApiKey)) {
        log(
            `${CRUX_API_KEY_ENVIRONMENT_VARIABLE} is not set, skipping the Core Web Vitals section. See packages/landing/docs/indexing.md.`
        );
    }

    if (!isNotEmptyString(serviceAccountKey) && !isNotEmptyString(cruxApiKey)) {
        log('No report secrets are available, so nothing was written. This is expected for forks, contributors and local runs.');

        return;
    }

    const report: SeoReportInterface = {
        generatedAt: new Date().toISOString(),
        origin: SITE_ORIGIN,
        searchConsole: isNotEmptyString(serviceAccountKey) ? await collectSearchConsole(serviceAccountKey) : null,
        coreWebVitals: isNotEmptyString(cruxApiKey) ? await collectCoreWebVitals(cruxApiKey) : null
    };
    const reportPath = writeReport(report);

    log(`Wrote ${reportPath}`);
    publishMarkdown(buildMarkdown(report, reportPath));
};

const handleReportError = (error: unknown): void => {
    console.error(`[seo-report] ${getErrorMessage(error)}`);
    process.exitCode = 1;
};

generateReport().catch(handleReportError);
