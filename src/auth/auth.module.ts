import { Module } from '@nestjs/common';
import { UserModule } from '@user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/service/auth.service';
import { JwtStrategy } from '@auth/strategies/jwt.strategy';
import { RefreshStrategy } from '@auth/strategies/refresh.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_ACCESS_SECRET');
        const expiresIn = configService.get<string>(
          'JWT_ACCESS_EXPIRES',
          '15m',
        );

        if (!secret) {
          throw new Error('ACCESS token is not defined');
        }

        return {
          secret,
          signOptions: {
            expiresIn: parseInt(expiresIn),
          },
        };
      },
    }),

    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshStrategy],
})
export class AuthModule {}
