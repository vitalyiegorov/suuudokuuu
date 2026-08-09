export interface FetchEndpoint {
    fetch: (request: Request) => Promise<Response>;
}
