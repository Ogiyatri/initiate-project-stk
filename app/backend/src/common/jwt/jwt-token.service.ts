import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import ConfigService from '@/config/config.service';

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

export interface GenerateTokenResult {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(payload: TokenPayload): GenerateTokenResult {
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: this.configService.jwt().expiresIn,
    };
  }

  verifyToken(token: string): TokenPayload {
    return this.jwtService.verify<TokenPayload>(token);
  }

  decodeToken(token: string): TokenPayload | null {
    return this.jwtService.decode(token);
  }
}
