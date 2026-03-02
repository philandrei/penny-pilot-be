import { Expose } from "class-transformer";

export abstract class AbstractBaseDto {
  @Expose()
  uuid: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
  @Expose()
  isDeleted: boolean;
}
