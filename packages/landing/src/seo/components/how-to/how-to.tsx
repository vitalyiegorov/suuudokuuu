import { findSlots } from '../../utils/find-slots.util';
import { HowToSchema } from '../how-to-schema/how-to-schema';
import { HowToStep } from '../how-to-step/how-to-step';

import type { ReactNode } from 'react';

interface Props {
    name: string;
    children: ReactNode;
}

export const HowTo = ({ children, name }: Props) => {
    const steps = findSlots(children, HowToStep);

    return (
        <>
            <HowToSchema name={name}>{children}</HowToSchema>
            <ol className="how-to">
                {steps.map(step => (
                    <li className="how-to__step" key={step.props.name}>
                        <strong className="how-to__step-name">{step.props.name}</strong>
                        <span>{step.props.children}</span>
                    </li>
                ))}
            </ol>
        </>
    );
};
