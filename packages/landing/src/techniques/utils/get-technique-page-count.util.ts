import { techniquesPageMetadata } from '../../app/techniques/metadata';
import { TECHNIQUE_PAGE_PATHS } from '../constants/technique-page-path.constant';

export const getTechniquePageCount = (): number =>
    Object.values(TECHNIQUE_PAGE_PATHS).filter(path => path !== techniquesPageMetadata.path).length;
