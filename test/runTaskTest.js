const assert = require('assert');
const runTask = require('../src/runTask');
const nock = require('nock');

describe('runTask', () => {
  it('returns metric', async () => {
    const queryBody = {
      size: 0,
      query: {
        range: {
          '@timestamp': {
            'gte': 'now-3600s/s',
            'lte': 'now/s'
          }
        }
      }
    };
    nock('https://elasticsearch.example.com')
      .get('/logs-*/_search')
      .reply(200, (uri, requestBody) => {
        assert.deepEqual(requestBody, queryBody);
        return {
          vals: [
            {name: 'foo', descr: 'baz', value: 1},
            {name: 'bar', value: 2}
          ]
        };
      });
    const metric = await runTask({
      query: {
        url: 'https://elasticsearch.example.com/logs-*/_search',
        method: 'get',
        data: queryBody
      },
      transformation: '$.vals',
      prometheusMetric: {
        name: 'my_metric',
        type: 'counter',
        description: 'this is my metric'
      }
    });
    assert.deepEqual(metric, `
# HELP my_metric this is my metric
# TYPE my_metric counter
my_metric{name="foo",descr="baz"} 1
my_metric{name="bar"} 2
`);
  });
});
