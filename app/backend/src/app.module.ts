import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/database.module';
import ConfigModule from '@/config/config.module';
import AuthModule from '@/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
