const controller = require('../src/controller');
const nock = require('nock');
const chai = require('chai');
const {expect} = chai;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('controller', () => {
  it('returns metrics', async () => {
    nock('https://httpbin.org')
      .get('/json')
      .reply(200, () => {
        return {
          'slideshow': {
            'author': 'Yours Truly',
            'date': 'date of publication',
            'slides': [
              {
                'title': 'Wake up to WonderWidgets!',
                'type': 'all'
              },
              {
                'items': [
                  'Why <em>WonderWidgets</em> are great',
                  'Who <em>buys</em> WonderWidgets'
                ],
                'title': 'Overview',
                'type': 'all'
              }
            ],
            'title': 'Sample Slide Show'
          }
        };
      });
    await chai.request(controller({configPath: './test/assets/controllerTest/config.yml'}))
      .get('/all/metrics')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res.text).to.eql(`
# HELP items_per_slide_count this is my metric
# TYPE items_per_slide_count counter
items_per_slide_count{title="Wake up to WonderWidgets!"} 0
items_per_slide_count{title="Overview"} 2
`);
        expect(res).to.have.header('Content-Type', 'text/plain; charset=utf-8');
      })
      .catch(function (err) {
        throw err;
      });
  });

  it('returns empty metrics', async () => {
    nock('https://httpbin.org')
      .get('/json')
      .reply(200, () => {
        return {};
      });
    await chai.request(controller({configPath: './test/assets/controllerTest/config.yml'}))
      .get('/all/metrics')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res.text).to.eql(`
# HELP items_per_slide_count this is my metric
# TYPE items_per_slide_count counter

`);
        expect(res).to.have.header('Content-Type', 'text/plain; charset=utf-8');
      })
      .catch(function (err) {
        throw err;
      });
  });

  it('returns http 500 for failed http query', async () => {
    nock('https://httpbin.org')
      .get('/json')
      .reply(500);
    await chai.request(controller({configPath: './test/assets/controllerTest/config.yml'}))
      .get('/all/metrics')
      .then(function (res) {
        expect(res).to.have.status(500);
        expect(res.text).to.have.string('Error: httpQuery failed Request failed with status code 500 with options={');
      })
      .catch(function (err) {
        throw err;
      });
  });

  it('returns http 500 for failed transform', async () => {
    nock('https://httpbin.org')
      .get('/json')
      .reply(200, () => {
        return {foo: 1};
      });
    await chai.request(controller({configPath: './test/assets/controllerTest/config-transform-invalid.yml'}))
      .get('/all/metrics')
      .then(function (res) {
        expect(res).to.have.status(500);
        expect(res.text).to.have.string(`Error: transform failed for $.foo.\n with json={"foo":1}`);
      })
      .catch(function (err) {
        throw err;
      });
  });

  it('returns http 500 for transformation that does not return array', async () => {
    nock('https://httpbin.org')
      .get('/json')
      .reply(200, () => {
        return {foo: 1};
      });
    await chai.request(controller({configPath: './test/assets/controllerTest/config-transform-no-array.yml'}))
      .get('/all/metrics')
      .then(function (res) {
        expect(res).to.have.status(500);
        expect(res.text).to.have.string(`Error: transform did not return array $.foo\n with json={"foo":1}`);
      })
      .catch(function (err) {
        throw err;
      });
  });
});
