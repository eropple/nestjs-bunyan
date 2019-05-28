# `@eropple/nestjs-bunyan` #
This package contains a module to provide Bunyan logging across a NestJS
application. It supports full request-specific logging by providing a
request-scoped Bunyan logger in the dependency injector and includes an
in/out interceptor for recording request data and request timing.

This module _requires_ you to be setting the `X-Correlation-Id` request
header. I (cough) recommend [@eropple/nestjs-correlation-id]().

[@eropple/nestjs-correlation-id]: https://github.com/eropple/nestjs-correlation-id
