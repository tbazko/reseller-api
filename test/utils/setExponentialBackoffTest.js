import { assert } from 'chai';
import { setExponentialBackoff } from '../../src/utils/setExponentialBackoff';

suite('setExponentialBackoff util function', () => {
  const minDelay = 100;
  const maxDelay = 8000;

  test('should return minimal delay (100)', () => {
    assert.isAbove(setExponentialBackoff(0, minDelay, maxDelay), 99);
  });

  test('should return maximum delay (100)', () => {
    assert.equal(setExponentialBackoff(10, minDelay, maxDelay), 8000);
  });

  test('should exponentially increase delay (ms) with jitter', () => {
    const step1 = setExponentialBackoff(0, minDelay, maxDelay);
    const step2 = setExponentialBackoff(1, minDelay, maxDelay);
    const step3 = setExponentialBackoff(2, minDelay, maxDelay);
    const step4 = setExponentialBackoff(3, minDelay, maxDelay);

    assert.isAtLeast(step1, 99);
    assert.isAtMost(step1, 112.5);

    assert.isAtLeast(step2, 175);
    assert.isAtMost(step2, 225);

    assert.isAtLeast(step3, 350);
    assert.isAtMost(step3, 450);

    assert.isAtLeast(step4, 700);
    assert.isAtMost(step4, 900);
  });
});
