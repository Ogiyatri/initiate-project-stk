
import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1777868804202 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "match_weighings" DROP CONSTRAINT "FK_match_weighings_match"');
    await queryRunner.query('ALTER TYPE "public"."match_weighings_red_status_enum" RENAME TO "match_weighings_red_status_enum_old"');
    await queryRunner.query('CREATE TYPE "public"."match_weighings_red_status_enum" AS ENUM(\'PENDING\', \'VALID\', \'DISQUALIFIED_OVERWEIGHT\', \'DISQUALIFIED_ABSENT\', \'DISQUALIFIED_UNDERWEIGHT\')');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "red_status" DROP DEFAULT');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "red_status" TYPE "public"."match_weighings_red_status_enum" USING "red_status"::"text"::"public"."match_weighings_red_status_enum"');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "red_status" SET DEFAULT \'PENDING\'');
    await queryRunner.query('DROP TYPE "public"."match_weighings_red_status_enum_old"');
    await queryRunner.query('ALTER TYPE "public"."match_weighings_blue_status_enum" RENAME TO "match_weighings_blue_status_enum_old"');
    await queryRunner.query('CREATE TYPE "public"."match_weighings_blue_status_enum" AS ENUM(\'PENDING\', \'VALID\', \'DISQUALIFIED_OVERWEIGHT\', \'DISQUALIFIED_ABSENT\', \'DISQUALIFIED_UNDERWEIGHT\')');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "blue_status" DROP DEFAULT');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "blue_status" TYPE "public"."match_weighings_blue_status_enum" USING "blue_status"::"text"::"public"."match_weighings_blue_status_enum"');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "blue_status" SET DEFAULT \'PENDING\'');
    await queryRunner.query('DROP TYPE "public"."match_weighings_blue_status_enum_old"');
    await queryRunner.query('ALTER TABLE "match_weighings" ADD CONSTRAINT "FK_a7b76de44a545a58692e2597c60" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop FK constraint added in up
    await queryRunner.query('ALTER TABLE "match_weighings" DROP CONSTRAINT "FK_a7b76de44a545a58692e2597c60"');

    // Revert red_status enum (5 values → 4 values)
    await queryRunner.query('ALTER TYPE "public"."match_weighings_red_status_enum" RENAME TO "match_weighings_red_status_enum_old"');
    await queryRunner.query('CREATE TYPE "public"."match_weighings_red_status_enum" AS ENUM(\'PENDING\', \'VALID\', \'DISQUALIFIED_OVERWEIGHT\', \'DISQUALIFIED_ABSENT\')');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "red_status" DROP DEFAULT');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "red_status" TYPE "public"."match_weighings_red_status_enum" USING "red_status"::"text"::"public"."match_weighings_red_status_enum"');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "red_status" SET DEFAULT \'PENDING\'');
    await queryRunner.query('DROP TYPE "public"."match_weighings_red_status_enum_old"');

    // Revert blue_status enum (5 values → 4 values)
    await queryRunner.query('ALTER TYPE "public"."match_weighings_blue_status_enum" RENAME TO "match_weighings_blue_status_enum_old"');
    await queryRunner.query('CREATE TYPE "public"."match_weighings_blue_status_enum" AS ENUM(\'PENDING\', \'VALID\', \'DISQUALIFIED_OVERWEIGHT\', \'DISQUALIFIED_ABSENT\')');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "blue_status" DROP DEFAULT');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "blue_status" TYPE "public"."match_weighings_blue_status_enum" USING "blue_status"::"text"::"public"."match_weighings_blue_status_enum"');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "blue_status" SET DEFAULT \'PENDING\'');
    await queryRunner.query('DROP TYPE "public"."match_weighings_blue_status_enum_old"');

    // Re-add original FK constraint
    await queryRunner.query('ALTER TABLE "match_weighings" ADD CONSTRAINT "FK_match_weighings_match" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
  }
}





import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1777868804202 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "match_weighings" DROP CONSTRAINT "FK_match_weighings_match"');
    await queryRunner.query('ALTER TYPE "public"."match_weighings_red_status_enum" RENAME TO "match_weighings_red_status_enum_old"');
    await queryRunner.query('CREATE TYPE "public"."match_weighings_red_status_enum" AS ENUM(\'PENDING\', \'VALID\', \'DISQUALIFIED_OVERWEIGHT\', \'DISQUALIFIED_ABSENT\', \'DISQUALIFIED_UNDERWEIGHT\')');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "red_status" DROP DEFAULT');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "red_status" TYPE "public"."match_weighings_red_status_enum" USING "red_status"::"text"::"public"."match_weighings_red_status_enum"');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "red_status" SET DEFAULT \'PENDING\'');
    await queryRunner.query('DROP TYPE "public"."match_weighings_red_status_enum_old"');
    await queryRunner.query('ALTER TYPE "public"."match_weighings_blue_status_enum" RENAME TO "match_weighings_blue_status_enum_old"');
    await queryRunner.query('CREATE TYPE "public"."match_weighings_blue_status_enum" AS ENUM(\'PENDING\', \'VALID\', \'DISQUALIFIED_OVERWEIGHT\', \'DISQUALIFIED_ABSENT\', \'DISQUALIFIED_UNDERWEIGHT\')');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "blue_status" DROP DEFAULT');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "blue_status" TYPE "public"."match_weighings_blue_status_enum" USING "blue_status"::"text"::"public"."match_weighings_blue_status_enum"');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "blue_status" SET DEFAULT \'PENDING\'');
    await queryRunner.query('DROP TYPE "public"."match_weighings_blue_status_enum_old"');
    await queryRunner.query('ALTER TABLE "match_weighings" ADD CONSTRAINT "FK_a7b76de44a545a58692e2597c60" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "match_weighings" DROP CONSTRAINT "FK_a7b76de44a545a58692e2597c60"');
    await queryRunner.query('ALTER TYPE "public"."match_weighings_red_status_enum" RENAME TO "match_weighings_red_status_enum_old"');
    await queryRunner.query('CREATE TYPE "public"."match_weighings_red_status_enum" AS ENUM(\'PENDING\', \'VALID\', \'DISQUALIFIED_OVERWEIGHT\', \'DISQUALIFIED_ABSENT\')');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "red_status" DROP DEFAULT');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "red_status" TYPE "public"."match_weighings_red_status_enum" USING "red_status"::"text"::"public"."match_weighings_red_status_enum"');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "red_status" SET DEFAULT \'PENDING\'');
    await queryRunner.query('DROP TYPE "public"."match_weighings_red_status_enum_old"');
    await queryRunner.query('ALTER TYPE "public"."match_weighings_blue_status_enum" RENAME TO "match_weighings_blue_status_enum_old"');
    await queryRunner.query('CREATE TYPE "public"."match_weighings_blue_status_enum" AS ENUM(\'PENDING\', \'VALID\', \'DISQUALIFIED_OVERWEIGHT\', \'DISQUALIFIED_ABSENT\')');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "blue_status" DROP DEFAULT');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "blue_status" TYPE "public"."match_weighings_blue_status_enum" USING "blue_status"::"text"::"public"."match_weighings_blue_status_enum"');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "blue_status" SET DEFAULT \'PENDING\'');
    await queryRunner.query('DROP TYPE "public"."match_weighings_blue_status_enum_old"');
    await queryRunner.query('ALTER TABLE "match_weighings" ADD CONSTRAINT "FK_match_weighings_match" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
  }
}
