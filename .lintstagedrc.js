const quoteFileNames = fileNames => fileNames.map(fileName => JSON.stringify(fileName)).join(' ');

const getLintTarget = fileName => {
    const relativePath = fileName.slice(process.cwd().length + 1);
    const workspace = relativePath.match(/^(?:packages|tests)\/[^/]+|^e2e(?=\/)/u);

    return workspace?.[0] ?? relativePath;
};

module.exports = {
    '*': fileNames => {
        const lintTargets = [...new Set(fileNames.filter(fileName => /\.(?:ts|tsx|mts|cts)$/u.test(fileName)).map(getLintTarget))];
        const lintCommands =
            lintTargets.length > 0
                ? [`effect-tsgo --tsrs-lint oxlint --type-aware --fix --no-error-on-unmatched-pattern ${quoteFileNames(lintTargets)}`]
                : [];

        return [...lintCommands, `oxfmt --no-error-on-unmatched-pattern ${quoteFileNames(fileNames)}`];
    }
};
