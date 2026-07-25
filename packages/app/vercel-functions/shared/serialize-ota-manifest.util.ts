import type { BetaRelease } from './beta-release.interface';

const DevelopmentAppTitle = ''.concat('suuudokuuu', ' ', '(', 'D', 'ev', ')');
const XmlDeclaration = ''.concat('<?', 'xml', ' ', 'version="1.0"', ' ', 'encoding="UTF-8"', '?>');
const XmlDocumentTypePublicIdentifier = ''.concat('"-//', 'A', 'pple', '//', 'DTD', ' ', 'PLIST', ' ', '1.0', '//', 'EN', '"');
const XmlDocumentType = ''.concat(
    '<!',
    'D',
    'OCTYPE',
    ' ',
    'plist',
    ' ',
    'PUBLIC',
    ' ',
    XmlDocumentTypePublicIdentifier,
    ' ',
    '"http://www.apple.com/DTDs/PropertyList-1.0.dtd"',
    '>'
);
const PlistOpeningTag = '<'.concat('plist', ' ', 'version="1.0"', '>');

const escapeXmlText = (value: string) =>
    value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');

export const serializeOtaManifest = ({ bundleVersion, ipaUrl }: Pick<BetaRelease, 'bundleVersion' | 'ipaUrl'>) =>
    [
        XmlDeclaration,
        XmlDocumentType,
        PlistOpeningTag,
        '<dict>',
        '    <key>items</key>',
        '    <array>',
        '        <dict>',
        '            <key>assets</key>',
        '            <array>',
        '                <dict>',
        '                    <key>kind</key>',
        '                    <string>software-package</string>',
        '                    <key>url</key>',
        `                    <string>${escapeXmlText(ipaUrl)}</string>`,
        '                </dict>',
        '            </array>',
        '            <key>metadata</key>',
        '            <dict>',
        '                <key>bundle-identifier</key>',
        '                <string>com.vitalyiegorov.suuudokuuu.dev</string>',
        '                <key>bundle-version</key>',
        `                <string>${escapeXmlText(bundleVersion)}</string>`,
        '                <key>kind</key>',
        '                <string>software</string>',
        '                <key>title</key>',
        `                <string>${DevelopmentAppTitle}</string>`,
        '            </dict>',
        '        </dict>',
        '    </array>',
        '</dict>',
        '</plist>'
    ].join('\n');
