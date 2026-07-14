export const DevelopmentReleaseApiUrl = 'https://api.github.com/repos/vitalyiegorov/suuudokuuu/releases?per_page=100';
export const DevelopmentReleaseTagPattern = /^development-(\d+)$/u;
export const DevelopmentIpaAssetName = 'suuudokuuu-development.ipa';
export const DevelopmentApkAssetName = 'suuudokuuu-development.apk';
export const DevelopmentChecksumsAssetName = 'SHA256SUMS';
export const DevelopmentReleaseAssetNames = [DevelopmentIpaAssetName, DevelopmentApkAssetName, DevelopmentChecksumsAssetName] as const;
export const DevelopmentMetadataMarkerPrefix = '<!--'.concat(' ', 'suuudokuuu-development-metadata', ' ');
export const MaximumChecksumsByteLength = 4096;
export const UpstreamRequestTimeoutMilliseconds = 10000;
