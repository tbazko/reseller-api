import { assert } from 'chai';
import sinon from 'sinon';
import { ServiceRequest } from '../../src/lib/serviceRequest';
import { isServerError } from '../../src/utils/errors';

suite('ServiceRequest class', () => {
  const options = {
    method: 'GET',
    uri: 'https://some-uri/path',
    headers: { 'x-test': 'test' },
  };

  test('should create an instance', () => {
    const r = new ServiceRequest(options);
    assert.instanceOf(r, ServiceRequest);
  });

  test('should set options without body', () => {
    const r = new ServiceRequest(options);
    assert.include(r.options, options);
    assert.isUndefined(options.body);
  });

  test('should set options with qs', () => {
    const r = new ServiceRequest(options, { test: 'test' });
    assert.include(r.options, options);
    assert.deepEqual(r.options.qs, { test: 'test' });
  });

  test('should set options with body', () => {
    const optionsPOST = { ...options, method: 'POST' };
    const r = new ServiceRequest(optionsPOST, { test: 'test' });
    assert.include(r.options, optionsPOST);
    assert.deepEqual(r.options.body, { test: 'test' });
  });

  test('should call request and return test response', async () => {
    const r = new ServiceRequest(options);
    const requestStub = sinon.stub(r, 'requestHelper').resolves({ test: 'response' });
    const res = await r.request();
    sinon.assert.calledOnce(requestStub);
    assert.deepEqual(res, { test: 'response' });
    requestStub.restore();
  });

  test('should recognize error as retriable network error', () => {
    const r = new ServiceRequest(options);
    assert.isTrue(r.isRetriable('ECONNRESET'));
    assert.isTrue(r.isRetriable('ENOTFOUND'));
    assert.isTrue(r.isRetriable('ESOCKETTIMEDOUT'));
    assert.isTrue(r.isRetriable('ETIMEDOUT'));
    assert.isTrue(r.isRetriable('ECONNREFUSED'));
    assert.isTrue(r.isRetriable('EHOSTUNREACH'));
    assert.isTrue(r.isRetriable('EPIPE'));
    assert.isTrue(r.isRetriable('EAI_AGAIN'));
  });

  test('should recognize error as NOT retriable', () => {
    const r = new ServiceRequest(options);
    assert.isFalse(r.isRetriable('OTHER'));
    assert.isFalse(r.isRetriable('ERROR'));
  });

  suite('if encounters retriable network error', () => {
    let clock;
    let requestStub;
    let r;
    let testErr;

    setup(() => {
      clock = sinon.useFakeTimers('setTimeout');
      r = new ServiceRequest(options);
      r.maxRetry = 3;
      r.minDelay = 200;
      r.maxDelay = 8000;
      testErr = new Error();
      testErr.code = 'ECONNREFUSED';
      requestStub = sinon.stub(r, 'requestHelper').throws(testErr);
    });

    teardown(() => {
      requestStub.restore();
      clock.restore();
    });

    test('should retry as much times as set in config (3 by default)', async () => {
      // wrapping in promise in order to make clock.tick() while request is performed
      await new Promise((resolve) => {
        r.request().catch(resolve);

        sinon.assert.callCount(requestStub, 1);
        clock.tick(225);
        sinon.assert.callCount(requestStub, 2);
        clock.tick(450);
        sinon.assert.callCount(requestStub, 3);
        clock.tick(900);
        sinon.assert.callCount(requestStub, 4); // 3 retries + the call itself = 4
        clock.tick(1800);
        sinon.assert.callCount(requestStub, 4);
      });
    });

    test('should, throw Internal Server Error if all retries failed', async () => {
      await new Promise((resolve) => {
        r.request()
          .catch((err) => {
            assert.isTrue(isServerError(err));
            resolve();
          });
        clock.tick(1800);
      });
    });

    test('should return response if one of requests succeeded', async () => {
      await new Promise((resolve) => {
        r.request().then(resolve);

        sinon.assert.callCount(requestStub, 1);
        requestStub = requestStub.resolves({ test: 'response' });
        clock.tick(225);
        sinon.assert.callCount(requestStub, 2); // original call + retry
      });
    });

    test('should stop retrying if request succeeded', async () => {
      await new Promise((resolve) => {
        r.request().then(resolve);
        requestStub = requestStub.resolves({ test: 'response' });
        clock.tick(225);
        sinon.assert.callCount(requestStub, 2); // original call + retry
        clock.tick(900);
        sinon.assert.callCount(requestStub, 2); // no more retries
      });
    });
  });

  test('should throw Internal Server error, if error is not retriable', async () => {
    const r = new ServiceRequest(options);
    const testErr = new Error('Test');
    const requestStub = sinon.stub(r, 'requestHelper').rejects(testErr);

    await new Promise((resolve) => {
      r.request()
        .catch((err) => {
          assert.equal(err.message, 'Request GET https://some-uri/path failed');
          assert.equal(err.cause, testErr);
          assert.isTrue(isServerError(err));
          resolve();
        });
    });
    requestStub.restore();
  });

  test('should throw immediatly, without retry, if error is not retriable', async () => {
    const r = new ServiceRequest(options);
    const testErr = new Error('Test');
    const requestStub = sinon.stub(r, 'requestHelper').rejects(testErr);

    await new Promise((resolve) => {
      r.request()
        .catch(() => {
          sinon.assert.callCount(requestStub, 1);
          resolve();
        });
    });
    requestStub.restore();
  });
});
