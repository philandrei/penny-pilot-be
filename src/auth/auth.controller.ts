import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LoginDto } from './dto/request/login.dto';
import { AuthService } from './service/auth.service';
import { RegistrationDto } from './dto/request/registration.dto';
import { type AuthenticatedRequest } from './auth-request.interface';
import { Public } from './decorators/public.decorator';
import { RefreshGuard } from './guards/refresh.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegistrationDto) {
    return this.authService.register(dto);
  }

  @Public()
  @UseGuards(RefreshGuard)
  @Post('refresh')
  refresh(@Req() req: AuthenticatedRequest) {
    return this.authService.refreshTokens(
      req.user.userId,
      req.user.refreshToken,
    );
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('logout')
  logout(@Req() req: AuthenticatedRequest) {
    return this.authService.logout(req.user.userId);
  }
}
