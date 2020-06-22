# bug-demo

Supporting evidence for [7860](https://github.com/serverless/serverless/issues/7860)

## Demo

**working = via vanilla sls**

- deploy
  ```sh
  npm run deploy
  ```
- take note of endpoints e.g. (yours will differ)
  ```log
  endpoints:
  GET - https://wr8rtcj3g9.execute-api.eu-west-2.amazonaws.com/hello
  ```
- call it

  ````sh
  curl https://wr8rtcj3g9.execute-api.eu-west-2.amazonaws.com/hello
  {"event":{"version":"1.0","resource":"/hello","path":"/hello","httpMethod":"GET","headers":{"Content-Length":"0","Host":"wr8rtcj3g9.execute-api.eu-west-2.amazonaws.com","User-Agent":"curl/7.58.0","X-Amzn-Trace-Id":"Root=1-5ef0a72c-b628d1e0bf0886b0f9221dc0","X-Forwarded-For":"41.164.75.218","X-Forwarded-Port":"443","X-Forwarded-Proto":"https","accept":"*/*"},"multiValueHeaders":{"Content-Length":["0"],"Host":["wr8rtcj3g9.execute-api.eu-west-2.amazonaws.com"],"User-Agent":["curl/7.58.0"],"X-Amzn-Trace-Id":["Root=1-5ef0a72c-b628d1e0bf0886b0f9221dc0"],"X-Forwarded-For":["41.164.75.218"],"X-Forwarded-Port":["443"],"X-Forwarded-Proto":["https"],"accept":["*/*"]},"queryStringParameters":null,"multiValueQueryStringParameters":null,"requestContext":{"accountId":"366730223589","apiId":"wr8rtcj3g9","domainName":"wr8rtcj3g9.execute-api.eu-west-2.amazonaws.com","domainPrefix":"wr8rtcj3g9","extendedRequestId":"Oh8O5hb4LPEEPaA=","httpMethod":"GET","identity":{"accessKey":null,"accountId":null,"caller":null,"cognitoAuthenticationProvider":null,"cognitoAuthenticationType":null,"cognitoIdentityId":null,"cognitoIdentityPoolId":null,"principalOrgId":null,"sourceIp":"41.164.75.218","user":null,"userAgent":"curl/7.58.0","userArn":null},"path":"/hello","protocol":"HTTP/1.1","requestId":"Oh8O5hb4LPEEPaA=","requestTime":"22/Jun/2020:12:42:20 +0000","requestTimeEpoch":1592829740096,"resourceId":"GET /hello","resourcePath":"/hello","stage":"$default"},"pathParameters":null,"stageVariables":null,"body":null,"isBase64Encoded":false},"context":{"callbackWaitsForEmptyEventLoop":true,"functionVersion":"$LATEST","functionName":"bug-demo-dev-hello","memoryLimitInMB":"1024","logGroupName":"/aws/lambda/bug-demo-dev-hello","logStreamName":"2020/06/22/[$LATEST]4329e7a8b89644cb849d9ffcfecaa5bc","invokedFunctionArn":"arn:aws:lambda:eu-west-2:366730223589:function:bug-demo-dev-hello","awsRequestId":"89d04fa1-aa80-4774-bf09-0a93e15d6157"},"message":"hello world"}
    ```
  ````

**broken = via sls framework**

- edit [serverless.yml](./serverless.yml)
- add the `sls framework` stuff e.g.:
  ```yaml
  org: ilanc
  app: bug-demo
  ```
- create the app in the dashboard.serverless.com
- deploy
  ```sh
  npm run deploy
  ```
- call it
  ```sh
  $ curl https://wr8rtcj3g9.execute-api.eu-west-2.amazonaws.com/hello
  {"message":"Internal Server Error"}
  ```
- stack in dashboard

```
02:28:21 pm
2020-06-22T12:28:21.889Z	a94a8b53-64f0-4591-891a-fceebc803b5c	ERROR	Error: Cannot find module './handler.main.js'
Require stack:
- /var/task/s_handler.js
- /var/runtime/UserFunction.js
- /var/runtime/index.js
    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:957:15)
    at Module._require.o.require (/var/task/serverless_sdk/index.js:9:72748)
    at require (internal/modules/cjs/helpers.js:77:18)
    at Object.<anonymous> (/var/task/s_handler.js:25:23)
    at Module._compile (internal/modules/cjs/loader.js:1133:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1153:10)
    at Module.load (internal/modules/cjs/loader.js:977:32)
    at Function.Module._load (internal/modules/cjs/loader.js:877:14)
    at Module.require (internal/modules/cjs/loader.js:1019:19)
    at require (internal/modules/cjs/helpers.js:77:18) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [
    '/var/task/s_handler.js',
    '/var/runtime/UserFunction.js',
    '/var/runtime/index.js'
  ]
}
```

## Problem

- as described the code injected by the serverless framework does not have the same resolution strategy as either vanilla sls and/or the lambda framework

## Solution

- change `s_handler.js` to implement this resolution method:
  - given `function.handler` = `handler: hello.main.get`
  - look for:
    - /tmp/hello.js => then call `main.post()`
    - /tmp/hello.main.js => then call `post()`
    - /tmp/hello.main.get.js => then call `default()` i guess?
