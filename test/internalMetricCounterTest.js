const assert = require('assert');
const internalMetricCounter = require('../src/internalMetricCounter');

describe('internalMetricCounter', () => {
  beforeEach(() => {
    internalMetricCounter.resetState();
  })
  
  it('returns value', () => {
    assert.equal(internalMetricCounter.get({foo: 1}), 0)
  });

  it('increments and returns value', () => {
    internalMetricCounter.increment({foo: 1})
    assert.equal(internalMetricCounter.get({foo: 1}), 1)
  });

  it('sets, gets and increments value', () => {
    internalMetricCounter.set({foo: 1}, 10)
    internalMetricCounter.set({foo: 2}, 20)
    internalMetricCounter.set({foo: 1, bar: 1}, 30)
    internalMetricCounter.set({foo: 1, baz: 1}, 40)
    assert.equal(internalMetricCounter.get({foo: 1}), 10)
    assert.equal(internalMetricCounter.get({foo: 2}), 20)
    assert.equal(internalMetricCounter.get({foo: 1, bar: 1}), 30)
    assert.equal(internalMetricCounter.get({foo: 1, baz: 1}), 40)
    internalMetricCounter.increment({foo: 1})
    internalMetricCounter.increment({foo: 2})
    internalMetricCounter.increment({foo: 1, bar: 1})
    internalMetricCounter.increment({foo: 1, baz: 1})
    assert.equal(internalMetricCounter.get({foo: 1}), 11)
    assert.equal(internalMetricCounter.get({foo: 2}), 21)
    assert.equal(internalMetricCounter.get({foo: 1, bar: 1}), 31)
    assert.equal(internalMetricCounter.get({foo: 1, baz: 1}), 41)
  });

  it('sets and gets labels', () => {
    internalMetricCounter.increment({foo: 1})
    internalMetricCounter.increment({foo: 2})
    internalMetricCounter.set({foo: 1, bar: 1}, 5)
    assert.deepEqual(internalMetricCounter.getLabels(), [
      {foo: "1"},
      {foo: "2"},
      {foo: "1", bar: "1"}
    ])
  });
});
