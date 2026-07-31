import { createBetaHandler } from '../../shared/create-beta-handler.util.js';

const handler = createBetaHandler('manifest');

export default { fetch: handler };
