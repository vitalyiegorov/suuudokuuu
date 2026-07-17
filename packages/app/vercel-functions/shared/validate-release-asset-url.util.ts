import { DevelopmentReleaseAssetNames, DevelopmentReleaseTagPattern } from './beta-release.constant';

const ReleaseDownloadUrlPrefix = 'https://github.com/vitalyiegorov/suuudokuuu/releases/download/';
const AllowedAssetNames = new Set<string>(DevelopmentReleaseAssetNames);

export const validateReleaseAssetUrl = (releaseAssetUrl: string, tagName: string, assetName: string) =>
    DevelopmentReleaseTagPattern.test(tagName) &&
    AllowedAssetNames.has(assetName) &&
    releaseAssetUrl === `${ReleaseDownloadUrlPrefix}${tagName}/${assetName}`;
