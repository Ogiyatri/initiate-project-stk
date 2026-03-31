import { Module, Global, DynamicModule, Type } from "@nestjs/common";
import {
  ConfigModule as NestConfigModule,
  ConfigService as NestConfigService,
} from "@nestjs/config";
import ConfigService from "./config.service";

@Global()
@Module({
  exports: [ConfigService, NestConfigService],
  providers: [ConfigService, NestConfigService],
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ["build/docker/.env"],
    }),
  ],
})
export default class ConfigModule implements DynamicModule {
  module: Type<any>;

  static forRoot() {
    return {
      module: ConfigModule,
      exports: [ConfigService, NestConfigService],
      providers: [ConfigService, NestConfigService],
      global: true,
      imports: [
        NestConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
    };
  }
}
