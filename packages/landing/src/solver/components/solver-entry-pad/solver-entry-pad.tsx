import { ENTRY_BLANK_CHARACTER, ENTRY_DIGITS } from '../../constants/puzzle-entry.constant';

interface Props {
    onEnterValue: (character: string) => void;
}

export const SolverEntryPad = ({ onEnterValue }: Props) => {
    const handleErase = () => {
        onEnterValue(ENTRY_BLANK_CHARACTER);
    };

    return (
        <div aria-label="Puzzle entry digits" className="solver-entry__pad" role="group">
            {ENTRY_DIGITS.map(digit => {
                const handleEnterDigit = () => {
                    onEnterValue(digit);
                };

                return (
                    <button className="solver-entry__digit" key={digit} onClick={handleEnterDigit} type="button">
                        {digit}
                    </button>
                );
            })}
            <button className="solver-entry__digit" onClick={handleErase} type="button">
                Erase
            </button>
        </div>
    );
};
