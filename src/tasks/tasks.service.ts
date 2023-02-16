import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Tasks, TaskStatus } from './tasks.model';
import { v4 as uuid } from 'uuid';
@Injectable()
export class TasksService {
  private tasks: Tasks[] = [];

  create(createTaskDto: CreateTaskDto): Tasks {
    const task = {
      id: uuid(),
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  findAll(): Tasks[] {
    return this.tasks;
  }

  findOne(id: string): Tasks {
    return this.tasks.find((task) => task.id === id);
  }

  update(id: string, updateTaskDto: UpdateTaskDto): Tasks {
    const task = this.findOne(id);
    task.status = updateTaskDto.status;
    return task;
  }

  remove(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}
