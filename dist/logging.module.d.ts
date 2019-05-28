import { DynamicModule } from '@nestjs/common';
import { NestModule, MiddlewareConsumer } from '@nestjs/common/interfaces';
import { LoggingOptions } from './options';
export declare class LoggingModule implements NestModule {
    static forRoot(options: Partial<LoggingOptions>): DynamicModule;
    configure(consumer: MiddlewareConsumer): void;
}
