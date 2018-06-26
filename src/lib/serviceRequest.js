import request from 'request-promise-native';
import { serverError } from '../utils/errors';
import { setExponentialBackoff } from '../utils/setExponentialBackoff';

const RETRIABLE_NETWORK_ERRORS =
  ['ECONNRESET', 'ENOTFOUND', 'ESOCKETTIMEDOUT', 'ETIMEDOUT', 'ECONNREFUSED', 'EHOSTUNREACH', 'EPIPE', 'EAI_AGAIN'];

export class ServiceRequest {
  constructor(options, payload) {
    this.requestHelper = request;
    this.response = null;
    this.payload = payload;
    this.attempts = 0;
    this.maxRetry = 10;
    this.minDelay = 20 * 1000;
    this.maxDelay = 40 * 1000;
    this.setOptions(options);
  }

  setOptions(options) {
    this.options = { json: true, ...options };
    if (this.payload) {
      this.options[(this.options.method === 'GET') ? 'qs' : 'body'] = this.payload;
    }
  }

  async request() {
    const { method, uri } = this.options;
    try {
      const response = await this.requestHelper(this.options);

      return response;
    } catch (err) {
      if (this.shouldRetry(err.code) || err.status === '429') {
        await this.retry();
      } else {
        throw serverError({ message: `Request ${method} ${uri} failed`, cause: err });
      }

      return null;
    }
  }

  shouldRetry(errCode) {
    return this.isRetriable(errCode) && this.attempts < this.maxRetry;
  }

  isRetriable(code) {
    return RETRIABLE_NETWORK_ERRORS.includes(code);
  }


  async retry() {
    // need to wait for setTimeout, because new retry (or response)
    // should happen only after previous call is finished
    await new Promise((resolve) => {
      setTimeout(() => {
        this.attempts += 1;
        const requestPromise = this.request();
        return resolve(requestPromise);
      }, setExponentialBackoff(this.attempts, this.minDelay, this.maxDelay));
    });
  }
}

export function serviceRequest(options, body) {
  const r = new ServiceRequest(options, body);
  return r.request();
}
