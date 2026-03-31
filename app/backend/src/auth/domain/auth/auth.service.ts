import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { comparePassword, hashPassword } from '@/common/hash/password';
import { JwtTokenService } from '@/common/jwt/jwt-token.service';
import RegisterRequest from '@/auth/application/rest/request/register.request';
import LoginRequest from '@/auth/application/rest/request/login.request';
import UserRepository from '@/auth/infrastructure/repository/user/user.repository';
import { UserEntity } from '@/auth/infrastructure/repository/user/user.entity';
import { UserRole } from '@/auth/domain/types/user-role.enum';
import { UserStatus } from '@/auth/domain/types/user-status.enum';
import awaitToError from '@/common/error/await-to-error';

export interface RegisterResponse {
  user: UserEntity;
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface LoginResponse {
  user: UserEntity;
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

@Injectable()
export default class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const passwordHash = await hashPassword(request.password);

    const user = this.userRepository.repository.create({
      email: request.email,
      passwordHash,
      fullName: request.fullName,
      phone: request.phone ?? null,
      role: request.role ?? UserRole.USER,
      status: UserStatus.ACTIVE,
      lastLoginAt: null,
    });

    const [err, savedUser] = await awaitToError<Error, UserEntity>(
      this.userRepository.repository.save(user),
    );
    if (err || !savedUser) {
      throw new BadRequestException('Gagal mendaftarkan pengguna');
    }

    const tokenResult = this.jwtTokenService.generateAccessToken({
      sub: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
    });

    return {
      user: savedUser,
      ...tokenResult,
    };
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw new UnauthorizedException('Email atau password tidak valid');
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Akun Anda telah dinonaktifkan');
    }

    const isPasswordValid = await comparePassword(
      request.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password tidak valid');
    }

    // Update last login
    await this.userRepository.repository.update(user.id, {
      lastLoginAt: new Date(),
    });

    const tokenResult = this.jwtTokenService.generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    // Remove passwordHash from response
    const { passwordHash: _, ...userWithoutPassword } = user as any;

    return {
      user: userWithoutPassword as UserEntity,
      ...tokenResult,
    };
  }
}
