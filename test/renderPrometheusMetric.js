const assert = require('assert');
const renderPrometheusMetric = require('../src/renderPrometheusMetric');

describe('renderPrometheusMetric', () => {
  it('returns metric', () => {
    const metric = renderPrometheusMetric({
      name: 'foo_count',
      description: 'number of foo',
      type: 'counter'
    }, [
      {
        'path': '/lala/foo/bar/baz',
        'status_code': 504,
        'value': 2
      },
      {
        'path': '/lala/foo/baz',
        'status_code': 404,
        'value': 1
      }
    ]);
    assert.deepEqual(metric, `
# HELP foo_count number of foo
# TYPE foo_count counter
foo_count{path="/lala/foo/bar/baz",status_code="504"} 2
foo_count{path="/lala/foo/baz",status_code="404"} 1
`);
  });

  it('throws', () => {
    assert.throws(() => {
      renderPrometheusMetric({
        name: 'foo_count',
        description: 'number of foo',
        type: 'counter'
      });
    }, {
      message: 'No measures given for {"name":"foo_count","description":"number of foo","type":"counter"}'
    });
  });
});
