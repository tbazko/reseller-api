import whois from 'whois';
import { chunk } from 'lodash';

export default function domainsLookUp() {
  return new DomainsLookUp();
}

class DomainsLookUp {
  constructor() {
    this._availableDomains = [];
  }

  getAvailable = async (domainsArr) => {
    await this._asyncForEachWithLimit(domainsArr, this._getAvailableDomains, 2);
    const availableDomains = [...this._availableDomains];
    this._availableDomains = [];
    return availableDomains;
  }

  _getAvailableDomains = async (domain) => {

    return new Promise((resolve, reject) => {
      whois.lookup(domain, (err, data) => {
        if (err) reject(err);
        if (this._isAvailable(data)) {
          this._availableDomains.push(domain);
        }

        resolve();
      });
    });
  }

  _isAvailable = (domainData) => {
    return domainData.indexOf('No match for domain') !== -1;
  }

  _asyncForEachWithLimit = async (arrItems, funcForEachItem, parallelCallsLimit = 1) => {
    return chunk(arrItems, parallelCallsLimit)
      .reduce((promise, itemBatch) => {
        return promise.then(
          () => Promise.all(itemBatch.map(funcForEachItem)),
        );
      }, Promise.resolve());
  }
}


