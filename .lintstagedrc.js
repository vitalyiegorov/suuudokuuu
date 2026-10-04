const quoteFileNames = fileNames => fileNames.map(fileName => JSON.stringify(fileName)).join(' ');

module.exports = {
    '*': fileNames => {
        const scriptFileNames = fileNames.filter(fileName => /\.tsx?$/u.test(fileName));
        const lintCommands =
            scriptFileNames.length > 0 ? [`oxlint --fix --no-error-on-unmatched-pattern ${quoteFileNames(scriptFileNames)}`] : [];

        return [...lintCommands, `oxfmt --no-error-on-unmatched-pattern ${quoteFileNames(fileNames)}`];
    }
};
