import { isDefined, isEmptyArray } from '@rnw-community/shared';

import { SCHEMA_CONTEXT } from '../../constants/schema.constant';
import { extractNodeText } from '../../utils/extract-node-text.util';
import { findSlot } from '../../utils/find-slot.util';
import { findSlots } from '../../utils/find-slots.util';
import { Faq } from '../faq/faq';
import { FaqAnswer } from '../faq-answer/faq-answer';
import { FaqHeading } from '../faq-heading/faq-heading';
import { FaqQuestion } from '../faq-question/faq-question';
import { JsonLd } from '../json-ld/json-ld';

import type { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

export const FaqPage = ({ children }: Props) => {
    const headingElement = findSlot(children, FaqHeading);
    const entries = findSlots(children, Faq).map(faqElement => {
        const questionElement = findSlot(faqElement.props.children, FaqQuestion);
        const answerElement = findSlot(faqElement.props.children, FaqAnswer);

        return {
            questionNode: questionElement?.props.children,
            answerNode: answerElement?.props.children,
            questionText: extractNodeText(questionElement?.props.children),
            answerText: extractNodeText(answerElement?.props.children)
        };
    });

    if (isEmptyArray(entries)) {
        return null;
    }

    const schema = {
        '@context': SCHEMA_CONTEXT,
        '@type': 'FAQPage',
        mainEntity: entries.map(entry => ({
            '@type': 'Question',
            name: entry.questionText,
            acceptedAnswer: { '@type': 'Answer', text: entry.answerText }
        }))
    };
    const heading = isDefined(headingElement) ? <h2>{headingElement.props.children}</h2> : null;

    return (
        <>
            <JsonLd data={schema} />
            <section>
                {heading}
                {entries.map(entry => (
                    <details key={entry.questionText}>
                        <summary>{entry.questionNode}</summary>
                        <p>{entry.answerNode}</p>
                    </details>
                ))}
            </section>
        </>
    );
};
