const fs = require('fs');
const assert = require('assert');
const transform = require('../src/transform');

describe('transformTest', () => {
  it('returns transformed', () => {
    const transformed = transform(`
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

  it('returns empty', () => {
    const transformed = transform('$.foo.bar', JSON.parse(fs.readFileSync('./test/assets/query-response.json', 'utf8')));
    assert.deepEqual(transformed, []);
  });

  it('returns object wrapped in array object', () => {
    const transformed = transform('$.foo', {foo: {bar: 1}});
    assert.deepEqual(transformed, [{bar: 1}]);
  });

  it('throws if not object', () => {
    assert.throws(() => {
      transform('1', {foo: 1});
    }, {
      message: 'transform did not return array for 1 with json={"foo":1}'
    });
  });

  it('throws', () => {
    assert.throws(() => {
      transform('$.foo.', {foo: 1});
    }, {
      message: 'transform failed for $.foo. with json={"foo":1}'
    });
  });
});
