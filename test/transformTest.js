const fs = require('fs');
const assert = require('assert');
const transform = require('../src/transform');

describe('transformTest', () => {
  it('returns transformed', async () => {
    const transformed = await transform(`
    $.aggregations.status_code_range.buckets.pages.buckets.(
      $req_path := $.key;
      $.status_codes.buckets.{
      "path": $req_path,
      "status_code": key,
      "value": doc_count
      }
      )
    `, JSON.parse(fs.readFileSync('./test/assets/query-response.json', 'utf8')));
    assert.deepEqual(transformed, JSON.parse(fs.readFileSync('./test/assets/query-response-normalized.json', 'utf8')));
  });

  it('returns empty', async () => {
    const transformed = await transform(`$.foo.bar`, JSON.parse(fs.readFileSync('./test/assets/query-response.json', 'utf8')));
    assert.deepEqual(transformed, []);
  });
});
