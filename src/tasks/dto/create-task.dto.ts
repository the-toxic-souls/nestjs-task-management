import { IsString } from 'class-validator';
import { IsTaskAlreadyExist } from 'src/utils/tasks.validtion';

export class CreateTaskDto {
  @IsTaskAlreadyExist({
    message: 'User $value already exists. Choose another name.',
  })
  title: string;

  description: string;
}
