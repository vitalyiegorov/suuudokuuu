export const gameResumeGetNavigationIntent = (pathname: string) => {
    if (pathname === '/game') {
        return 'stay';
    }

    if (pathname === '/pause') {
        return 'replace';
    }

    return 'push';
};
