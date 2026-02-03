import { AbstractBaseDto } from '@abstracts/abstract-base-dto';

export class AccountDetailsDto extends AbstractBaseDto {
  name: string;
  balance: string;
  isDefault: boolean;
}
