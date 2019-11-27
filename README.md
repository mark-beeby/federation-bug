# federation-bug

This repository contains two projects to demonstrate a potential bug with the Apollo Federation 
`experimental_pollInterval` setting, and it not updating the gateway as expected when changes are detected.

#### Behaviour Desired

When changing the customer service schema to introduce a new (or rename an existing) field, I expect the gateway to
pick up changes and allow me to continue querying without having to restart the gateway each time when  
`experimental_pollInterval` is set.

#### Repeatable Steps

* Run `npm install` in the gateway and service folders. 
* Start the customer service in its respective folder (`node index.js`)
* Start the gateway service in its respective folder (`node index.js`)
* Comment out the field `somethingx` 
* Uncomment the field `somethingy`
* Restart the customer service
* Refresh playground (optional) to view autocomplete registers `somethingy`

#### Expected Results

The gateway will detect the change and allow queries to run in playground (http://localhost:4000) against the 
somethingy field, e.g.

`query { customer: customer{  name, somethingy } }`

#### Actual Results

The gateway's playground does detect the change and show a `somethingy` field when using  autocomplete, but the 
query is unsuccessful until the gateway itself is restarted. The error given is:-

```
{
  "error": {
    "errors": [
      {
        "message": "Cannot query field \"somethingy\" on type \"Customer\". Did you mean \"somethingx\"?",
        "locations": [
          {
            "line": 5,
            "column": 5
          }
        ],
        "extensions": {
          "code": "GRAPHQL_VALIDATION_FAILED",
          "exception": {
            "stacktrace": [
              "GraphQLError: Cannot query field \"somethingy\" on type \"Customer\". Did you mean \"somethingx\"?",
              "    at Object.Field (/home/mark/WebstormProjects/gateway-pg/node_modules/graphql/validation/rules/FieldsOnCorrectType.js:53:31)",
              "    at Object.enter (/home/mark/WebstormProjects/gateway-pg/node_modules/graphql/language/visitor.js:324:29)",
              "    at Object.enter (/home/mark/WebstormProjects/gateway-pg/node_modules/graphql/language/visitor.js:375:25)",
              "    at visit (/home/mark/WebstormProjects/gateway-pg/node_modules/graphql/language/visitor.js:242:26)",
              "    at Object.validate (/home/mark/WebstormProjects/gateway-pg/node_modules/graphql/validation/validate.js:73:24)",
              "    at validate (/home/mark/WebstormProjects/gateway-pg/node_modules/apollo-server-core/dist/requestPipeline.js:210:32)",
              "    at Object.<anonymous> (/home/mark/WebstormProjects/gateway-pg/node_modules/apollo-server-core/dist/requestPipeline.js:125:42)",
              "    at Generator.next (<anonymous>)",
              "    at fulfilled (/home/mark/WebstormProjects/gateway-pg/node_modules/apollo-server-core/dist/requestPipeline.js:5:58)",
              "    at processTicksAndRejections (internal/process/task_queues.js:93:5)"
            ]
          }
        }
      }
    ]
  }
}
```

The logs from Gateway clearly show a change has been detected:-

```
[DEBUG] Wed Nov 27 2019 19:04:46 GMT+0000 (Greenwich Mean Time) apollo-gateway: Loading configuration for gateway
[INFO] Wed Nov 27 2019 19:04:46 GMT+0000 (Greenwich Mean Time) apollo-gateway: Gateway config has changed, updating schema
[DEBUG] Wed Nov 27 2019 19:04:46 GMT+0000 (Greenwich Mean Time) apollo-gateway: Composing schema from service list: 
  http://localhost:4001: customers
[DEBUG] Wed Nov 27 2019 19:04:46 GMT+0000 (Greenwich Mean Time) apollo-gateway: Schema loaded and ready for execution
```
