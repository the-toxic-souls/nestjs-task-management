import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Tasks, TaskStatus } from './tasks.model';
import { v4 as uuid } from 'uuid';
import { Search } from './dto/get-search-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}
  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.taskRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: TaskStatus.OPEN,
      user: user,
    });
    await this.taskRepository.save(task);
    return task;
  }

  async findAll(filterDto: Search, user: User): Promise<Task[]> {
    const query = this.taskRepository.createQueryBuilder('task');
    query.where({ user });
    return await query.getMany();
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

  async findOne(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: {
        id: parseInt(id),
        user: {
          username: user.username,
        },
      },
    });
    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return found;
  }

  update(id: string, updateTaskDto: UpdateTaskDto, user: User) {
    return this.taskRepository.update(parseInt(id), updateTaskDto);
  }

  remove(id: string, user: User): Promise<DeleteResult> {
    return this.taskRepository
      .createQueryBuilder('task')
      .delete()
      .andWhere('user = :user', { user: user })
      .where('id = :id', { id: parseInt(id) })
      .execute();
  }
}
