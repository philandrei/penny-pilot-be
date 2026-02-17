import { AbstractBaseDto } from '@abstracts/abstract-base-dto';

export class UserDetailsDto extends AbstractBaseDto {
  email: string;
  fullName: string;
  isActive: boolean;
}
