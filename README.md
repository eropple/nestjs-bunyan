# `@eropple/nestjs-bunyan` #
[![npm version](https://badge.fury.io/js/%40eropple%2Fnestjs-bunyan.svg)](https://badge.fury.io/js/%40eropple%2Fnestjs-bunyan)

This package contains a module to provide Bunyan logging across a NestJS
application. It supports full request-specific logging by providing a
request-scoped Bunyan logger in the dependency injector and includes an
in/out interceptor for recording request data and request timing.

## Recent Changes ##
### 0.5.4 ###
- Added `method` and `url` to the end events for request logging. This
  is a convenience addition to make request timing easier. (h/t @briankracoff)

### 0.5.2 ###
- Exported `BunyanLoggerService` from `@eropple/nestjs-bunyan-logger` into
  this package. No good reason to keep them separate now that
  `@eropple/nestjs-bunyan` is more or less mature.
- Exported `CorrelationIdMiddleware()` from `@eropple/nestjs-correlation-id`
  for the same reason.

### 0.5.1 ###
- Begun to rename injector keys, prepending them with `NESTJS_BUNYAN_`. So
  `InjectorKeys.ROOT_LOGGER` now sits alongside
  `InjectorKeys.NESTJS_BUNYAN_ROOT_LOGGER`. In a future version, the former
  will be removed.
- Exported all entries in `InjectorKeys` in the package namespace, so you
  no longer have to import `InjectorKeys` directory. I don't know what I
  was thinking there. `InjectorKeys` will be un-exported in a future version.

### 0.5.0 ###
- **BREAKING CHANGE**: Now uses an interceptor instead of a middleware. The
  upside is that it no longer requires calling something explicitly to set
  up request tracking.
- IP address pseudonymization implemented. Off by default. To enable, pass
  `{ ipSalt: 'someString' }` in your logging options.

## Installation ##
`yarn add @eropple/nestjs-bunyan` or `npm install --save @eropple/nestjs-bunyan`
depending on your package manager of choice.

## Usage ##
`@eropple/nestjs-bunyan` expects you to define a Bunyan logger somewhere in your
application--a global, a logger via ConfigService, whatever makes the most sense
for your application.

Import it at the root of your application:

```ts
import { Module } from '@nestjs/common';
import { LoggingModule } from "@eropple/nestjs-bunyan";

import { ROOT_LOGGER } from './logger';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    LoggingModule.forRoot(ROOT_LOGGER, {})
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

This will do a few things:

- It **adds the root logger to the DI container**. You can get it with the
  `@RootLogger()` decorator on your constructor parameter. (You can use this
  with `Scope.DEFAULT` injected services.)
- It **adds the request logger to the DI container**. This logger includes the
  request's correlation ID with every log entry. You can get it with the
  `@Logger()` decorator on your constructor parameter. You must only use this
  with `Scope.REQUEST` injected services (and NestJS should transitively make
  anything that depends on `@Logger()` a request-scoped provider automatically.)
- It **adds the request interceptor to your request chain**. See "Request
  Tracking", below.

**Important note:** this module expects a request to have some kind of
[correlation ID](). By default, this will be `X-Correlation-Id` (and if you need
to inject that, might I recommend [@eropple/nestjs-correlation-id]()?), but you
can change it to, for example, `X-Request-Id`, by passing something like
`correlationIdHeader: "X-Request-Id"` to the options in
`LoggingModule.forRoot()`.

### Request Tracking ###
`@eropple/nestjs-bunyan` also includes a request tracking interceptor that
records into the log the start and end of every request coming into your server.
The start log entry includes all request headers; the end log entry includes the
time taken with the request and the status code. You can use these, plus the
correlation ID, to determine overall request timings.

The implementation is currently a little tortured (to write, not to use), so
it's implemented a little differently than normal. Use it a-like so:

The request middleware records timing in milliseconds, so it _probably_ doesn't
matter too much where in your interceptor chain you do it, but it's probably
best to put it as early in the process as possible, I usually import
`LoggingModule.forRoot` at the very top of my app module for this reason.

#### IP Address Pseudonymization ####
This middleware, as of version 0.5.0, can pseudonymize IP addresses for you. This
may potentially be of use to you in working with GDPR and other privacy regulations
(don't take my word for it, talk to your data privacy officer or a GDPR-focused
lawyer).

Any string passed to `LoggingOptions.ipSalt` will turn on pseudonymization. This
uses `shake128` for hashing, which is a bit overkill for IP+salt hashing but it
produces a shorter hash that's easier for humans to work with.


### Controller Example ###
```ts
import * as Bunyan from "bunyan";
import { Controller, Get, Scope } from '@nestjs/common';
import { Logger } from "@eropple/nestjs-bunyan";

import { AppService } from './app.service';

@Controller({ scope: Scope.REQUEST })
export class AppController {
  private readonly _logger: Bunyan;

  constructor(
    @Logger() requestLogger: Bunyan,
    private readonly appService: AppService
  ) {
    this._logger = requestLogger.child({ component: this.constructor.name });
  }

  @Get()
  getHello(): Promise<string> {
    return new Promise((resolve, reject) => {
      this._logger.info("getHello hit; pausing.");

      setTimeout(() => {
        this._logger.info('getHello done!');
        resolve(this.appService.getHello());
      }, 1000)
    })
  }
}
```

And some sample output, when passed through the `bunyan` executable:

```
[2019-05-29T01:58:11.789Z]  INFO: example-app/RequestTracker/27937 on bigboss:  (correlationId=7f8901a5-8706-4059-875a-fb69a28a4213, request=start, method=GET, url=/, ip=::1)
    headers: {
      "host": "localhost:3000",
      "user-agent": "curl/7.61.1",
      "accept": "*/*",
      "x-correlation-id": "7f8901a5-8706-4059-875a-fb69a28a4213"
    }
[2019-05-29T01:58:11.796Z]  INFO: example-app/AppController/27937 on bigboss: getHello hit; pausing. (correlationId=7f8901a5-8706-4059-875a-fb69a28a4213)
[2019-05-29T01:58:12.799Z]  INFO: example-app/AppController/27937 on bigboss: getHello done! (correlationId=7f8901a5-8706-4059-875a-fb69a28a4213)
[2019-05-29T01:58:12.802Z]  INFO: example-app/RequestTracker/27937 on bigboss:  (correlationId=7f8901a5-8706-4059-875a-fb69a28a4213, request=end, code=200, ms=1013)
```

[@eropple/nestjs-correlation-id]: https://github.com/eropple/nestjs-correlation-id
