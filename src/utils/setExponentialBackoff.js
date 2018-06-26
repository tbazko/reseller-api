/* eslint-disable no-mixed-operators, no-restricted-properties */

export function setExponentialBackoff(attempts, minDelay, maxDelay, jitter = 0.5) {
  const factor = 2;
  const currentDelay = minDelay * Math.pow(factor, attempts);
  const prevDelay = minDelay * Math.pow(factor, attempts - 1);
  const range = (currentDelay - prevDelay) * jitter;
  const from = currentDelay - (range / 2);
  const to = currentDelay + (range / 2);
  const randomDelayFromRange = Math.floor(Math.random() * (to - from + 1)) + from;
  return Math.max(minDelay, Math.min(randomDelayFromRange, maxDelay));
}
