import { conflictError } from '../../utils/errors';
import domainsLookUp from '../../services/domainsLookUp';

/**
 * GET /domains/available?domains=domain1,domain2
 */
export default async function getDomainsAvailable(req, res) {
  const availableDomains = await domainsLookUp().getAvailable(req.query.domains.split(','));
  return res.status(200).json({ availableDomains });
}
