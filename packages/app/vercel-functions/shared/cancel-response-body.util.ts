export const cancelResponseBody = async (body: Pick<NonNullable<Response['body']>, 'cancel'> | null) => {
    if (body === null) {
        return true;
    }

    try {
        await body.cancel();
    } catch {
        return false;
    }

    return true;
};
