import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegistrationDto } from '../dto/request/registration.dto';
import { UserDetailsDto } from '@user/dto/response/user-details.dto';
import { UserService } from '@user/service/user.service';
import { UserType } from '@user/enum/user.enum';
import { LoginDto } from '../dto/request/login.dto';
import { AuthResponse } from '../dto/response/auth-response.dto';
import { UserEntity } from '@user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { compare } from '@common/utils/hash';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(data: RegistrationDto): Promise<UserDetailsDto> {
    const existingUser = await this.userService.findByEmail(data.email);

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    return this.userService.createUser({
      ...data,
      userType: UserType.LOCAL,
    });
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    const user: UserEntity | null = await this.userService.findByEmail(
      data.email,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await compare(data.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueTokens(user);
  }

  async logout(userId: string) {
    await this.userService.updateRefreshToken(userId, null);
    return 'success';
  }

  async refreshTokens(refreshToken: string): Promise<AuthResponse> {
    const payload = await this.jwtService.verifyAsync<{ sub: string }>(
      refreshToken,
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      },
    );
    const userId = payload.sub;

    const existingUser = await this.userService.getUserEntityById(userId);
    if (!existingUser || !existingUser.refreshToken) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await compare(refreshToken, existingUser.refreshToken);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return await this.issueTokens(existingUser);
  }

  private async issueTokens(user: UserDetailsDto): Promise<AuthResponse> {
    const payload = { sub: user.uuid };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES'),
    });

    void (await this.userService.updateRefreshToken(user.uuid, refreshToken));

    return {
      accessToken,
      refreshToken,
      user: {
        uuid: user.uuid,
        email: user.email,
        createdAt: user.createdAt,
        isDeleted: user.isDeleted,
        updatedAt: user.updatedAt,
        fullName: user.fullName,
        isActive: user.isActive,
      },
    };
  }
}
