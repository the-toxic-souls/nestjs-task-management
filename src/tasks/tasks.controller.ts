import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Search } from './dto/get-search-task.dto';
import { Task } from './entities/task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../utils/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { Logger } from '@nestjs/common';
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger();
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    this.logger.log(`Task created: ${createTaskDto.title}`);
    return this.tasksService.create(createTaskDto, user);
  }

  @Get()
  findAll(@Query() filterDto: Search, @GetUser() user: User): Promise<Task[]> {
    return this.tasksService.findAll(filterDto, user);
  }

  // @Get()
  // findAll(@Query() filterDto: Search) {
  //   if (Object.keys(filterDto).length) {
  //     return this.tasksService.getTasksWithFilters(filterDto);
  //   } else {
  //     return this.tasksService.findAll();
  //   }
  // }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.tasksService.findOne(id, user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ) {
    await this.tasksService.findOne(id, user);
    return this.tasksService.update(id, updateTaskDto, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetUser() user: User) {
    await this.tasksService.findOne(id, user);
    return this.tasksService.remove(id, user);
  }
}
