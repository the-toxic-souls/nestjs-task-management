import { IsAlphanumeric, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsAlphanumeric()
  password: string;
}
