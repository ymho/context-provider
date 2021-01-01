# Context-provider

This is a simple Node.js express application which offers an NGSI proxy interface to four context providers.

Support only NGSI v2.

## NGSI v2 `op/query` Endpoints
Supported NGSI-v2 context provider endpoints.

* `/health/gov/`. returns random data values (Health Check).

* `/gov/covid-19/<city>/<data>/<schema>/op/query` returns some data.

The following dynamic NGSI v2 endpoints are supported