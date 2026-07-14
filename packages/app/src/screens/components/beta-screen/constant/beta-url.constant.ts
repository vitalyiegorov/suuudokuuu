const BetaReleaseApiPath = '/api/beta/release';
const BetaProductionOrigin = 'https://www.suuudokuuu.com';
export const BetaReleaseApiUrl = process.env.EXPO_OS === 'web' ? BetaReleaseApiPath : `${BetaProductionOrigin}${BetaReleaseApiPath}`;
export const BetaIosInstallUrl = 'itms-services://?action=download-manifest&url=https%3A%2F%2Fwww.suuudokuuu.com%2Fota%2Fmanifest.plist';
export const BetaAndroidInstallUrl = 'https://www.suuudokuuu.com/api/beta/apk';
export const BetaCommitUrlPrefix = 'https://github.com/vitalyiegorov/suuudokuuu/commit/';
