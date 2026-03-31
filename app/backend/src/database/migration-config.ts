import { DataSource } from "typeorm";
import { NestFactory } from "@nestjs/core";
import * as fs from "node:fs";
import { argv } from "node:process";
import awaitToError from "@/common/error/await-to-error";
import { DatabaseModule } from "./database.module";

export async function generate(dataSource: DataSource) {
  const timestamp = Date.now();
  const file = `src/database/migration/${timestamp}.ts`;

  const schemaBuilder = dataSource.driver.createSchemaBuilder();
  const sql = await schemaBuilder.log();

  if (sql.upQueries.length === 0) {
    console.log("No migration required.");
    return;
  }

  const content = `
import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration${timestamp} implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
${sql.upQueries
  .map((q) => {
    q.query = q.query.replaceAll("'", String.raw`\'`);
    return `    await queryRunner.query('${q.query}');`;
  })
  .join("\n")}
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
${sql.downQueries
  .map((q) => {
    q.query = q.query.replaceAll("'", String.raw`\'`);
    return `    await queryRunner.query('${q.query}');`;
  })
  .join("\n")}
  }
}
`;
  fs.writeFileSync(file, content);
  const [error] = await awaitToError(
    Promise.resolve(fs.chmodSync(file, 0o666)),
  );
  if (error) {
    console.warn(
      "Failed to set permissions for migration file:",
      (error as Error).message,
    );
  }
}

export async function run(dataSource: DataSource) {
  await dataSource.runMigrations();
}

export async function revert(dataSource: DataSource) {
  await dataSource.undoLastMigration();
}

export default async function migrationCommand() {
  const [errorCtx, appModule] = await awaitToError(
    NestFactory.createApplicationContext(DatabaseModule),
  );

  if (errorCtx) {
    console.error("Failed to create application context:", errorCtx);
    return;
  }

  const db = appModule.get<DataSource>("DATA_SOURCE");

  let error: any;
  if (argv.includes("migration:generate")) {
    console.log("Generating migration...");
    [error] = await awaitToError(generate(db));
  } else if (argv.includes("migration:run")) {
    console.log("Running migrations...");
    [error] = await awaitToError(run(db));
  } else if (argv.includes("migration:revert")) {
    console.log("Reverting last migration...");
    [error] = await awaitToError(revert(db));
  } else {
    console.log("No valid migration command provided.");
    console.log(
      "Valid commands: migration:generate, migration:run, migration:revert",
    );
  }

  if (error) {
    console.error("Migration command failed:", error);
  }

  await appModule.close();
}
