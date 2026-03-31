import { Injectable, Module } from "@nestjs/common";
import { DatabaseModule } from "../database.module";
import ConfigModule from "@/config/config.module";
import ConfigService from "@/config/config.service";
import { SuperAdminSeeder } from "./super-admin.seeder";
import { BaseSeeder } from "./base.seeder";
import { Inject } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Logger } from "@nestjs/common";
import awaitToError from "@/common/error/await-to-error";

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @Inject("DATA_SOURCE") private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  private getSeeders(): BaseSeeder[] {
    return [new SuperAdminSeeder(this.dataSource, this.configService)];
  }

  async seedSuperAdmin(): Promise<void> {
    this.logger.log("🌱 Starting super admin seeding...");
    const seeder = new SuperAdminSeeder(this.dataSource, this.configService);
    const [err] = await awaitToError(seeder.run());
    if (err) {
      this.logger.error(`Seeder failed: ${err.message}`);
      throw err;
    }
    this.logger.log("✅ Super admin seeding completed!");
  }

  async seedAll(names?: string[]): Promise<void> {
    const isFiltered = names && names.length > 0;
    this.logger.log(
      `🌱 Starting database seeding${isFiltered ? ` for: ${names.join(", ")}` : ""}...`,
    );

    let seeders: BaseSeeder[];
    if (isFiltered) {
      seeders = this.getSeeders().filter((s) =>
        names.includes(s.constructor.name),
      );
      if (seeders.length === 0) {
        this.logger.error(`No seeders found for: ${names.join(", ")}`);
        return;
      }
    } else {
      seeders = this.getSeeders();
    }

    for (const seeder of seeders) {
      const [err] = await awaitToError(seeder.run());
      if (err) {
        this.logger.error(
          `Seeder ${seeder.constructor.name} failed: ${err.message}`,
        );
        throw err;
      }
    }

    this.logger.log("✅ All seeders completed!");
  }
}

@Module({
  imports: [DatabaseModule, ConfigModule],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
