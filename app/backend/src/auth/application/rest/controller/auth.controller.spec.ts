import { Test, TestingModule } from "@nestjs/testing";
import AuthController from "@/auth/application/rest/controller/auth.controller";
import AuthService from "@/auth/domain/auth/auth.service";
import RegisterRequest from "@/auth/application/rest/request/register.request";
import LoginRequest from "@/auth/application/rest/request/login.request";
import { UserRole } from "@/auth/domain/types/user-role.enum";
import { UserStatus } from "@/auth/domain/types/user-status.enum";
import { UserEntity } from "@/auth/infrastructure/repository/user/user.entity";

describe("AuthController", () => {
  let controller: AuthController;

  const mockTokenResult = {
    accessToken: "mock.access.token",
    tokenType: "Bearer",
    expiresIn: 86400,
  };

  const mockUser: Partial<UserEntity> = {
    id: "uuid-1234",
    email: "user@stk.id",
    fullName: "Test User",
    phone: null,
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    lastLoginAt: null,
  };

  const mockAuthService = {
    register: jest
      .fn()
      .mockResolvedValue({ user: mockUser, ...mockTokenResult }),
    login: jest.fn().mockResolvedValue({ user: mockUser, ...mockTokenResult }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
    mockAuthService.register.mockResolvedValue({
      user: mockUser,
      ...mockTokenResult,
    });
    mockAuthService.login.mockResolvedValue({
      user: mockUser,
      ...mockTokenResult,
    });
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("register", () => {
    it("should call authService.register and return result", async () => {
      const request = Object.assign(new RegisterRequest(), {
        email: "newuser@stk.id",
        password: "Password@123",
        fullName: "New User",
      });

      const result = await controller.register(request);

      expect(mockAuthService.register).toHaveBeenCalledWith(request);
      expect(result).toEqual({ user: mockUser, ...mockTokenResult });
    });
  });

  describe("login", () => {
    it("should call authService.login and return result", async () => {
      const request = Object.assign(new LoginRequest(), {
        email: "user@stk.id",
        password: "Password@123",
      });

      const result = await controller.login(request);

      expect(mockAuthService.login).toHaveBeenCalledWith(request);
      expect(result).toEqual({ user: mockUser, ...mockTokenResult });
    });
  });
});
