import { expect } from '@playwright/test';

import type { APIRequestContext } from '@playwright/test';

const OK_STATUS = 200;

export const fetchPageHtml = async (request: APIRequestContext, path: string): Promise<string> => {
    const response = await request.get(path);

    expect(response.status(), `GET ${path}`).toBe(OK_STATUS);

    return response.text();
};
