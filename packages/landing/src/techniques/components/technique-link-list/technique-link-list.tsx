import { Fragment } from 'react';

import { TechniqueLink } from '../technique-link/technique-link';

import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

interface Props {
    techniques: SolutionTechniqueEnum[];
}

const resolveSeparator = (index: number, lastIndex: number): string => {
    if (index === 0) {
        return '';
    }

    if (index === lastIndex) {
        return ' and ';
    }

    return ', ';
};

export const TechniqueLinkList = ({ techniques }: Props) => {
    const lastIndex = techniques.length - 1;

    return techniques.map((technique, index) => (
        <Fragment key={technique}>
            {resolveSeparator(index, lastIndex)}
            <TechniqueLink technique={technique} />
        </Fragment>
    ));
};
