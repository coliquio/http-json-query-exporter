# http-json-query-exporter

![https://travis-ci.com/coliquio/http-json-query-exporter.svg?branch=master](https://travis-ci.com/coliquio/http-json-query-exporter.svg?branch=master)

Query http endpoints, transform and export response to prometheus.

## Features

- Call any http endpoint that returns valid `JSON`
- Transform response with [https://docs.jsonata.org](https://docs.jsonata.org) ([http://try.jsonata.org/](http://try.jsonata.org/))
- Exports results as [https://prometheus.io/](https://prometheus.io/) metrics

## Run

### Using nodejs

### Install dependencies

    npm install
    
### Start server

    CONFIG_FILE=example/config.yml npm start

### Get metrics

1. Queries https://httpbin.org/json
2. Runs transformation
3. Returns prometheus metrics

    curl localhost:8000/all/metrics
    # HELP items_per_slide_count this is my metric
    # TYPE items_per_slide_count counter
    items_per_slide_count{title="Wake up to WonderWidgets!"} 0
    items_per_slide_count{title="Overview"} 2

### Using docker

    docker run --rm -p 8000 coliquiode/http-json-query-exporter

## Configuring tasks

Use the YAML configuration like so:

    tasks:
      - query:
          url: 'https://httpbin.org/json'
        transformation: |
          $.slideshow.slides.{"title": title, "value": $count(items)}
        prometheusMetric:
          name: 'items_per_slide_count'
          type: 'counter'
          description: 'this is my metric'
      # - <2nd-task>
      # - <3rd...>

This produces metrics like:

    # HELP items_per_slide_count this is my metric
    # TYPE items_per_slide_count counter
    items_per_slide_count{title="Wake up to WonderWidgets!"} 0
    items_per_slide_count{title="Overview"} 2

### `task.query`

Define a http query here, the only mandatory argument is `url` and it must return valid `JSON`.

All valid `axios.request({...})` parameters like `method`, `body`, etc. are accepted [https://github.com/axios/axios#request-config]([https://github.com/axios/axios#request-config]).

### `tasks.transformation`

Define [JSONata](https://docs.jsonata.org/) queries to transform the http query result into a array of objects for exporting metrics:

- The object `value` keys are used reserved and used as metric value
- All other object keys are used as metric labels

See also [http://try.jsonata.org/][http://try.jsonata.org/].

### `tasks.prometheusMetric`

Specify metric name, description and type like so.

## CI Environment

![https://travis-ci.com/coliquio/http-json-query-exporter.svg?branch=master](https://travis-ci.com/coliquio/http-json-query-exporter.svg?branch=master)

See [https://travis-ci.com/coliquio/http-json-query-exporter](https://travis-ci.com/coliquio/http-json-query-exporter)

## License

See [LICENSE](LICENSE).

## Disclaimer

This is a project for the community, from developers for developers. This is NOT an official coliquio product. I.e. Maintenance and support are provided by the individual developers but not officially by coliquio.
