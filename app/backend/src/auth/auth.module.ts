import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import UserRepository from "@/auth/infrastructure/repository/user/user.repository";
import AuthService from "@/auth/domain/auth/auth.service";
import { JwtTokenService } from "@/common/jwt/jwt-token.service";
import { JwtStrategy } from "@/common/guards/jwt.strategy";
import ConfigService from "@/config/config.service";
import AuthController from "@/auth/application/rest/controller/auth.controller";

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.jwt().secret,
        signOptions: {
          expiresIn: configService.jwt().expiresIn,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [UserRepository, AuthService, JwtTokenService, JwtStrategy],
  exports: [UserRepository, AuthService, JwtTokenService, JwtStrategy],
})
export default class AuthModule {}
