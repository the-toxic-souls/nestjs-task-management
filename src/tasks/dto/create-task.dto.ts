import { IsString } from 'class-validator';
import { IsTaskAlreadyExist } from '../../utils/tasks.validtion';

export class CreateTaskDto {
  @IsTaskAlreadyExist({
    message: 'User $value already exists. Choose another name.',
  })
  @IsString()
  title: string;

  @IsString()
  description: string;
}
