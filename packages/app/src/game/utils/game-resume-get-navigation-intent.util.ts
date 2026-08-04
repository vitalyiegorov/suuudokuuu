export const gameResumeGetNavigationIntent = (pathname: string) => {
    if (pathname === '/game') {
        return 'stay';
    }

    return 'replace';
};
