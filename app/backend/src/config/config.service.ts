import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

interface DatabaseConfig {
  port: number;
  host: string;
  database: string;
  username: string;
  password: string;
  maxPool: number;
}

interface AppConfig {
  port: number;
  name: string;
  corsOrigin: string[];
}

interface JwtConfig {
  secret: string;
  expiresIn: number;
}

interface SuperAdminConfig {
  email: string;
  password: string;
  name: string;
  phone: string;
}

interface SeederConfig {
  superAdmin: SuperAdminConfig;
}

interface MultipartConfig {
  fileSize: number;
  files: number;
  fieldNameSize: number;
  fieldSize: number;
  fields: number;
}

@Injectable()
export default class ConfigService {
  constructor(private readonly config: NestConfigService) {}

  database(): DatabaseConfig {
    return {
      port: this.config.get<number>('DB_PORT') ?? 5432,
      host: this.config.get<string>('DB_HOST') ?? 'localhost',
      database: this.config.get<string>('DB_NAME') ?? 'stk_db',
      username: this.config.get<string>('DB_USERNAME') ?? 'stk_user',
      password: this.config.get<string>('DB_PASSWORD') ?? 'stk_password',
      maxPool: this.config.get<number>('DB_MAX_POOL') ?? 10,
    };
  }

  app(): AppConfig {
    return {
      port: this.config.get<number>('PORT') ?? 3000,
      name: this.config.get<string>('APP_NAME') ?? 'stk-backend',
      corsOrigin: this.config.get<string>('CORS_ORIGIN')?.split(',') ?? [
        'http://localhost:3000',
        'http://localhost:3001',
      ],
    };
  }

  jwt(): JwtConfig {
    return {
      secret:
        this.config.get<string>('JWT_SECRET') ?? 'your-secret-key-change-this',
      expiresIn: Number.parseInt(
        this.config.get<string>('JWT_EXPIRES_IN') || '86400',
        10,
      ),
    };
  }

  seeder(): SeederConfig {
    return {
      superAdmin: {
        email: this.config.get<string>('SUPER_ADMIN_EMAIL') ?? 'admin@stk.id',
        password:
          this.config.get<string>('SUPER_ADMIN_PASSWORD') ?? 'Admin@123',
        name:
          this.config.get<string>('SUPER_ADMIN_NAME') ?? 'Super Administrator',
        phone: this.config.get<string>('SUPER_ADMIN_PHONE') ?? '081234567890',
      },
    };
  }

  multipart(): MultipartConfig {
    return {
      fileSize:
        this.config.get<number>('MULTIPART_FILE_SIZE_LIMIT') ?? 10000000,
      files: this.config.get<number>('MULTIPART_FILES_LIMIT') ?? 10,
      fieldNameSize:
        this.config.get<number>('MULTIPART_FIELD_NAME_SIZE_LIMIT') ?? 100,
      fieldSize:
        this.config.get<number>('MULTIPART_FIELD_SIZE_LIMIT') ?? 1000000,
      fields: this.config.get<number>('MULTIPART_FIELDS_LIMIT') ?? 100,
    };
  }
}
