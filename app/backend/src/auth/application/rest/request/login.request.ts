import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export default class LoginRequest {
  @ApiProperty({ description: "Email address", example: "user@example.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: "Password", example: "SecurePass123" })
  @IsString()
  @IsNotEmpty()
  password: string;
}
