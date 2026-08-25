import Link from 'next/link';

import { TECHNIQUE_NAMES } from '../../constants/technique-name.constant';
import { TECHNIQUE_PAGE_PATHS } from '../../constants/technique-page-path.constant';

import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

interface Props {
    technique: SolutionTechniqueEnum;
}

export const TechniqueLink = ({ technique }: Props) => <Link href={TECHNIQUE_PAGE_PATHS[technique]}>{TECHNIQUE_NAMES[technique]}</Link>;
