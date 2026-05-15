
import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1777881747693 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "match_weighings" DROP CONSTRAINT "FK_match_weighings_match"');
    await queryRunner.query('ALTER TYPE "public"."matches_status_enum" RENAME TO "matches_status_enum_old"');
    await queryRunner.query('CREATE TYPE "public"."matches_status_enum" AS ENUM(\'SCHEDULED\', \'VALIDATING_WEIGHT\', \'WEIGHT_VALIDATED\', \'WEIGHT_SUBMITTED\', \'WEIGHT_INVALID\', \'READY_TO_START\', \'ONGOING\', \'PAUSED\', \'FINISHED\', \'WINNER_DECLARED\', \'VOID\')');
    await queryRunner.query('ALTER TABLE "matches" ALTER COLUMN "status" DROP DEFAULT');
    await queryRunner.query('ALTER TABLE "matches" ALTER COLUMN "status" TYPE "public"."matches_status_enum" USING "status"::"text"::"public"."matches_status_enum"');
    await queryRunner.query('ALTER TABLE "matches" ALTER COLUMN "status" SET DEFAULT \'SCHEDULED\'');
    await queryRunner.query('DROP TYPE "public"."matches_status_enum_old"');
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
    // 1. Drop the FK that up re-added (with auto-generated name)
    await queryRunner.query('ALTER TABLE "match_weighings" DROP CONSTRAINT "FK_a7b76de44a545a58692e2597c60"');

    // 2. Revert blue_status enum (no-op values — same 5 values, just cycle to satisfy TypeORM)
    await queryRunner.query('ALTER TYPE "public"."match_weighings_blue_status_enum" RENAME TO "match_weighings_blue_status_enum_old"');
    await queryRunner.query("CREATE TYPE \"public\".\"match_weighings_blue_status_enum\" AS ENUM('PENDING', 'VALID', 'DISQUALIFIED_OVERWEIGHT', 'DISQUALIFIED_ABSENT', 'DISQUALIFIED_UNDERWEIGHT')");
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "blue_status" DROP DEFAULT');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "blue_status" TYPE "public"."match_weighings_blue_status_enum" USING "blue_status"::"text"::"public"."match_weighings_blue_status_enum"');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "blue_status" SET DEFAULT \'PENDING\'');
    await queryRunner.query('DROP TYPE "public"."match_weighings_blue_status_enum_old"');

    // 3. Revert red_status enum (no-op values)
    await queryRunner.query('ALTER TYPE "public"."match_weighings_red_status_enum" RENAME TO "match_weighings_red_status_enum_old"');
    await queryRunner.query("CREATE TYPE \"public\".\"match_weighings_red_status_enum\" AS ENUM('PENDING', 'VALID', 'DISQUALIFIED_OVERWEIGHT', 'DISQUALIFIED_ABSENT', 'DISQUALIFIED_UNDERWEIGHT')");
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "red_status" DROP DEFAULT');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "red_status" TYPE "public"."match_weighings_red_status_enum" USING "red_status"::"text"::"public"."match_weighings_red_status_enum"');
    await queryRunner.query('ALTER TABLE "match_weighings" ALTER COLUMN "red_status" SET DEFAULT \'PENDING\'');
    await queryRunner.query('DROP TYPE "public"."match_weighings_red_status_enum_old"');

    // 4. Revert matches status enum — remove WEIGHT_INVALID
    await queryRunner.query('ALTER TYPE "public"."matches_status_enum" RENAME TO "matches_status_enum_old"');
    await queryRunner.query("CREATE TYPE \"public\".\"matches_status_enum\" AS ENUM('SCHEDULED', 'VALIDATING_WEIGHT', 'WEIGHT_VALIDATED', 'WEIGHT_SUBMITTED', 'READY_TO_START', 'ONGOING', 'PAUSED', 'FINISHED', 'WINNER_DECLARED', 'VOID')");
    await queryRunner.query('ALTER TABLE "matches" ALTER COLUMN "status" DROP DEFAULT');
    await queryRunner.query('ALTER TABLE "matches" ALTER COLUMN "status" TYPE "public"."matches_status_enum" USING "status"::"text"::"public"."matches_status_enum"');
    await queryRunner.query('ALTER TABLE "matches" ALTER COLUMN "status" SET DEFAULT \'SCHEDULED\'');
    await queryRunner.query('DROP TYPE "public"."matches_status_enum_old"');

    // 5. Re-add original FK with original name
    await queryRunner.query('ALTER TABLE "match_weighings" ADD CONSTRAINT "FK_match_weighings_match" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE NO ACTION');
  }
}
