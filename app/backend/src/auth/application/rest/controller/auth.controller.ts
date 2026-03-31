import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Public } from "@/common/decorators/public.decorator";
import AuthService from "@/auth/domain/auth/auth.service";
import RegisterRequest from "../request/register.request";
import LoginRequest from "../request/login.request";

@ApiTags("Authentication")
@Controller("v1/auth")
@UseGuards(JwtAuthGuard, RolesGuard)
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  @ApiOperation({
    summary: "Registrasi pengguna baru",
    description: "Daftarkan pengguna baru ke dalam sistem.",
  })
  @ApiResponse({
    status: 201,
    description: "Berhasil mendaftarkan pengguna baru",
  })
  @ApiResponse({ status: 400, description: "Input tidak valid" })
  @ApiResponse({ status: 409, description: "Email sudah terdaftar" })
  async register(@Body() request: RegisterRequest) {
    return this.authService.register(request);
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Login pengguna",
    description: "Autentikasi pengguna untuk mendapatkan access token JWT",
  })
  @ApiResponse({ status: 200, description: "Login berhasil" })
  @ApiResponse({ status: 401, description: "Kredensial tidak valid" })
  async login(@Body() request: LoginRequest) {
    return this.authService.login(request);
  }
}
