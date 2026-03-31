import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774959002799 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TYPE \"public\".\"users_role_enum\" AS ENUM('SUPER_ADMIN', 'ADMIN', 'USER')",
    );
    await queryRunner.query(
      "CREATE TYPE \"public\".\"users_status_enum\" AS ENUM('ACTIVE', 'SUSPENDED')",
    );
    await queryRunner.query(
      'CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying(255) NOT NULL, "password_hash" character varying(255) NOT NULL, "full_name" character varying(255) NOT NULL, "phone" character varying(20), "role" "public"."users_role_enum" NOT NULL, "status" "public"."users_status_enum" NOT NULL DEFAULT \'ACTIVE\', "last_login_at" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TYPE "public"."users_role_enum"');
    await queryRunner.query('DROP TYPE "public"."users_status_enum"');
    await queryRunner.query('DROP TABLE "users"');
  }
}
