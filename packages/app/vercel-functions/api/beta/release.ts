import { createBetaHandler } from '../../shared/create-beta-handler.util.js';

const handler = createBetaHandler('release');

export default { fetch: handler };
