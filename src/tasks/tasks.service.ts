import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Tasks, TaskStatus } from './tasks.model';
import { v4 as uuid } from 'uuid';
import { Search } from './dto/get-search-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { DeleteResult, Repository } from 'typeorm';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: TaskStatus.OPEN,
    });
    await this.taskRepository.save(task);
    return task;
  }

  async findAll(filterDto: Search): Promise<Task[]> {
    return await this.taskRepository.find({
      skip: filterDto.page,
      take: filterDto.limit,
    });
  }

  // getTasksWithFilters(filterDto: Search): Tasks[] {
  //   const { status, search } = filterDto;

  //   let tasks = this.findAll();

  //   // do something with status
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }

  //   if (search) {
  //     tasks = tasks.filter((task) => {
  //       if (task.title.includes(search) || task.description.includes(search)) {
  //         return true;
  //       }

  //       return false;
  //     });
  //   }

  //   return tasks;
  // }

  async findOne(id: string): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: {
        id: parseInt(id),
      },
    });
    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return found;
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    return this.taskRepository.update(parseInt(id), updateTaskDto);
  }

  remove(id: string): Promise<DeleteResult> {
    return this.taskRepository.delete(parseInt(id));
  }
}
