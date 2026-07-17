import { createBetaHandler } from '../../shared/create-beta-handler.util';

const handler = createBetaHandler('manifest');

export default { fetch: handler };
