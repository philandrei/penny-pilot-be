import { UserDetailsDto } from '@user/dto/response/user-details.dto';

export class AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDetailsDto;
}
