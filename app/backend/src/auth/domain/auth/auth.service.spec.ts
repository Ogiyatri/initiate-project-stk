import { Test, TestingModule } from "@nestjs/testing";
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import AuthService from "@/auth/domain/auth/auth.service";
import UserRepository from "@/auth/infrastructure/repository/user/user.repository";
import { JwtTokenService } from "@/common/jwt/jwt-token.service";
import { UserRole } from "@/auth/domain/types/user-role.enum";
import { UserStatus } from "@/auth/domain/types/user-status.enum";
import { UserEntity } from "@/auth/infrastructure/repository/user/user.entity";
import * as passwordUtils from "@/common/hash/password";

describe("AuthService", () => {
  let service: AuthService;

  const mockTokenResult = {
    accessToken: "mock.access.token",
    tokenType: "Bearer",
    expiresIn: 86400,
  };

  const mockUser: Partial<UserEntity> = {
    id: "uuid-1234",
    email: "user@stk.id",
    passwordHash: "hashed-password",
    fullName: "Test User",
    phone: null,
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    lastLoginAt: null,
  };

  const mockUserRepository = {
    findByEmail: jest.fn(),
    repository: {
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtTokenService = {
    generateAccessToken: jest.fn().mockReturnValue(mockTokenResult),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: JwtTokenService, useValue: mockJwtTokenService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
    mockJwtTokenService.generateAccessToken.mockReturnValue(mockTokenResult);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  // ─── register ────────────────────────────────────────────────────────────────

  describe("register", () => {
    const registerRequest = {
      email: "newuser@stk.id",
      password: "Password@123",
      fullName: "New User",
      phone: "08123456789",
    };

    it("should register a new user and return token", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.repository.create.mockReturnValue({
        ...mockUser,
        email: registerRequest.email,
      });
      mockUserRepository.repository.save.mockResolvedValue({
        ...mockUser,
        email: registerRequest.email,
      });

      jest
        .spyOn(passwordUtils, "hashPassword")
        .mockResolvedValue("hashed-password");

      const result = await service.register(registerRequest);

      expect(result.accessToken).toBe(mockTokenResult.accessToken);
      expect(result.tokenType).toBe("Bearer");
      expect(result.expiresIn).toBe(86400);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        registerRequest.email,
      );
      expect(mockUserRepository.repository.save).toHaveBeenCalled();
    });

    it("should throw ConflictException if email already exists", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.register(registerRequest)).rejects.toThrow(
        ConflictException,
      );
    });

    it("should throw BadRequestException if save fails", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.repository.create.mockReturnValue({ ...mockUser });
      mockUserRepository.repository.save.mockRejectedValue(
        new Error("DB error"),
      );

      jest
        .spyOn(passwordUtils, "hashPassword")
        .mockResolvedValue("hashed-password");

      await expect(service.register(registerRequest)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // ─── login ───────────────────────────────────────────────────────────────────

  describe("login", () => {
    const loginRequest = {
      email: "user@stk.id",
      password: "Password@123",
    };

    it("should login and return token for valid credentials", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      mockUserRepository.repository.update.mockResolvedValue({ affected: 1 });

      jest.spyOn(passwordUtils, "comparePassword").mockResolvedValue(true);

      const result = await service.login(loginRequest);

      expect(result.accessToken).toBe(mockTokenResult.accessToken);
      expect(result.tokenType).toBe("Bearer");
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        loginRequest.email,
      );
      expect(mockUserRepository.repository.update).toHaveBeenCalled();
    });

    it("should throw UnauthorizedException if user not found", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginRequest)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("should throw UnauthorizedException if user is suspended", async () => {
      mockUserRepository.findByEmail.mockResolvedValue({
        ...mockUser,
        status: UserStatus.SUSPENDED,
      });

      await expect(service.login(loginRequest)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("should throw UnauthorizedException if password is wrong", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(passwordUtils, "comparePassword").mockResolvedValue(false);

      await expect(service.login(loginRequest)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
