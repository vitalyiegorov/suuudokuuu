export const handleGeneratorError = (error: unknown): void => {
    console.error(error);
    process.exitCode = 1;
};
