import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsIn } from 'class-validator';
import { TaskStatus } from '../tasks.model';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
