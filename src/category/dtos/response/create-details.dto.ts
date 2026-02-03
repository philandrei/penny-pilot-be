import { AbstractBaseDto } from '@abstracts/abstract-base-dto';

export class CategoryDetailsDto extends AbstractBaseDto {
  userId: string;
  name: string;
  color: string;
  icon: string;
}
