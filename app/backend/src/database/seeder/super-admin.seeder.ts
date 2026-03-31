import { DataSource } from "typeorm";
import { BaseSeeder } from "./base.seeder";
import { UserEntity } from "@/auth/infrastructure/repository/user/user.entity";
import { UserRole } from "@/auth/domain/types/user-role.enum";
import { UserStatus } from "@/auth/domain/types/user-status.enum";
import ConfigService from "@/config/config.service";
import * as bcrypt from "bcrypt";

export class SuperAdminSeeder extends BaseSeeder {
  constructor(
    dataSource: DataSource,
    private configService: ConfigService,
  ) {
    super(dataSource);
  }

  async run(): Promise<void> {
    this.logger.log("Starting Super Admin seeder...");

    const userRepository = this.dataSource.getRepository(UserEntity);

    const existingSuperAdmin = await userRepository.findOne({
      where: { role: UserRole.SUPER_ADMIN },
    });

    if (existingSuperAdmin) {
      this.logger.warn("Super Admin already exists. Skipping...");
      return;
    }

    const seederConfig = this.configService.seeder();
    const {
      email: adminEmail,
      password: adminPassword,
      name: adminFullName,
      phone: adminPhone,
    } = seederConfig.superAdmin;

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const superAdmin = userRepository.create({
      email: adminEmail,
      passwordHash: hashedPassword,
      fullName: adminFullName,
      phone: adminPhone,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
    });

    await userRepository.save(superAdmin);

    this.logger.log("✅ Super Admin created successfully!");
    this.logger.log(`Email: ${adminEmail}`);
    this.logger.log("⚠️  Please change the password after first login!");
  }
}
