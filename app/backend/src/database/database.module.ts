import { Global, Module } from "@nestjs/common";
import { databaseProviders } from "./provider";
import ConfigModule from "@/config/config.module";
import DatabaseService from "./database.service";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [...databaseProviders, DatabaseService],
  exports: [...databaseProviders, DatabaseService],
})
export class DatabaseModule {}
