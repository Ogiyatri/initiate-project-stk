import ConfigService from '@/config/config.service';
import { DataSource } from 'typeorm';

export const DATA_SOURCE_KEY = 'DATA_SOURCE';

export const databaseProviders = [
  {
    provide: DATA_SOURCE_KEY,
    useFactory: async (configService: ConfigService) => {
      const dbConfig = configService.database();
      const dataSource = new DataSource({
        type: 'postgres',
        host: dbConfig.host,
        port: dbConfig.port,
        username: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.database,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        poolSize: dbConfig.maxPool,
        synchronize: false,
        migrations: [__dirname + '/migration/*{.ts,.js}'],
      });
      return dataSource.initialize();
    },
    inject: [ConfigService],
  },
];
