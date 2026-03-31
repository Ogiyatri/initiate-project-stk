import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { JwtTokenService } from "@/common/jwt/jwt-token.service";
import ConfigService from "@/config/config.service";
import { UserRole } from "@/auth/domain/types/user-role.enum";

describe("JwtTokenService", () => {
  let service: JwtTokenService;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue("mock.jwt.token"),
    verify: jest.fn().mockReturnValue({
      sub: "user-id",
      email: "test@stk.id",
      role: UserRole.USER,
    }),
    decode: jest.fn().mockReturnValue({
      sub: "user-id",
      email: "test@stk.id",
      role: UserRole.USER,
    }),
  };

  const mockConfigService = {
    jwt: jest.fn().mockReturnValue({ secret: "test-secret", expiresIn: 86400 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtTokenService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<JwtTokenService>(JwtTokenService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("generateAccessToken", () => {
    it("should return accessToken, tokenType and expiresIn", () => {
      const payload = {
        sub: "user-id",
        email: "test@stk.id",
        role: UserRole.ADMIN,
      };
      const result = service.generateAccessToken(payload);

      expect(result.accessToken).toBe("mock.jwt.token");
      expect(result.tokenType).toBe("Bearer");
      expect(result.expiresIn).toBe(86400);
      expect(mockJwtService.sign).toHaveBeenCalledWith(payload);
    });
  });

  describe("verifyToken", () => {
    it("should call jwtService.verify and return payload", () => {
      const result = service.verifyToken("mock.jwt.token");
      expect(mockJwtService.verify).toHaveBeenCalledWith("mock.jwt.token");
      expect(result).toEqual({
        sub: "user-id",
        email: "test@stk.id",
        role: UserRole.USER,
      });
    });
  });

  describe("decodeToken", () => {
    it("should call jwtService.decode and return payload", () => {
      const result = service.decodeToken("mock.jwt.token");
      expect(mockJwtService.decode).toHaveBeenCalledWith("mock.jwt.token");
      expect(result).toEqual({
        sub: "user-id",
        email: "test@stk.id",
        role: UserRole.USER,
      });
    });
  });
});
