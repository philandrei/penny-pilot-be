import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { LoginDto } from './dto/request/login.dto';
import { AuthService } from './service/auth.service';
import { RegistrationDto } from './dto/request/registration.dto';
import { type AuthenticatedRequest } from './auth-request.interface';
import { Public } from './decorators/public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegistrationDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('refresh')
  refresh(@Req() req: Request) {
    return this.authService.refreshTokens(req.cookies.refreshToken);
  }

  @Public()
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(dto);

    res.cookie(
      this.configService.getOrThrow<string>('COOKIE_NAME'),
      token.refreshToken,
      {
        httpOnly:
          this.configService.getOrThrow<string>('COOKIE_HTTP_ONLY') === 'true',
        secure:
          this.configService.getOrThrow<string>('COOKIE_SECURE') === 'true',
        sameSite: this.configService.getOrThrow('COOKIE_SAMESITE'),
        path: this.configService.getOrThrow<string>('COOKIE_PATH'),
        maxAge: this.configService.getOrThrow<number>('COOKIE_MAX_AGE'), //7days
      },
    );
    return {
      accessToken: token.accessToken,
      user: token.user,
    };
  }

  @Post('logout')
  logout(@Req() req: AuthenticatedRequest) {
    return this.authService.logout(req.user.userId);
  }
}
