import { isEmptyArray } from '@rnw-community/shared';

import { SCHEMA_CONTEXT } from '../../constants/schema.constant';
import { extractNodeText } from '../../utils/extract-node-text.util';
import { findSlots } from '../../utils/find-slots.util';
import { HowToStep } from '../how-to-step/how-to-step';
import { JsonLd } from '../json-ld/json-ld';

import type { ReactNode } from 'react';

interface Props {
    name: string;
    children: ReactNode;
}

export const HowToSchema = ({ children, name }: Props) => {
    const steps = findSlots(children, HowToStep).map((stepElement, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: stepElement.props.name,
        text: extractNodeText(stepElement.props.children)
    }));

    if (isEmptyArray(steps)) {
        return null;
    }

    const schema = {
        '@context': SCHEMA_CONTEXT,
        '@type': 'HowTo',
        name,
        step: steps
    };

    return <JsonLd data={schema} />;
};
