import { createBetaHandler } from '../../shared/create-beta-handler.util';

const handler = createBetaHandler('release');

export default { fetch: handler };
