const assert = require('assert');
const loadConfig = require('../src/loadConfig');

describe('loadConfig', () => {
  it('returns', async () => {
    const config = await loadConfig('./test/assets/config.yml');
    assert.deepEqual(config, {
      tasks: [
        {
          query: {
            url: 'https://elasticsearch.example.com/logs-*/_search',
            body: `{
  "size": 0,
  "query": {
    "range": {
      "@timestamp": {
        "gte": "now-3600s/s",
        "lte": "now/s"
      }
    }
  }
}
`
          },
          transformation: `$.aggregations[].status_code_range[].buckets[].pages[].buckets.(
  $req_path := $.key;
  $.status_codes.buckets.{
    "path": $req_path,
    "status_code": key,
    "value": doc_count
  }
)
`,
          prometheusMetric: {
            name: 'my_metric',
            type: 'counter',
            description: 'this is my metric'
          }
        }
      ]
    });
  });
});
