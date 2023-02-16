import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Tasks, TaskStatus } from './tasks.model';
import { v4 as uuid } from 'uuid';
import { Search } from './dto/get-search-task.dto';
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

  getTasksWithFilters(filterDto: Search): Tasks[] {
    const { status, search } = filterDto;

    let tasks = this.findAll();

    // do something with status
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }

        return false;
      });
    }

    return tasks;
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
