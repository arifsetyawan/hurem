import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Delete,
    Put,
    Patch,
    Query,
    UsePipes,
    ValidationPipe,
    NotFoundException,
    ParseIntPipe, UseGuards, UseInterceptors, ClassSerializerInterceptor, Logger,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './tasks.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/user.entity';
import { GetUser } from '../users/user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TaskController');
    constructor(private tasksServices: TasksService) {}

    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilterDto,
        @GetUser() user: User,
    ): Promise<Task[]> {
        this.logger.verbose(`User ${user.username} Retreiving all task. ${JSON.stringify(filterDto)}`);
        return this.tasksServices.getTasks(filterDto, user);
    }

    @Get(':id')
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<Task> {
        return this.tasksServices.getTaskById(id, user);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto,
        @GetUser() user: User,
    ): Promise<Task> {
        return this.tasksServices.createTask(createTaskDto, user);
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User,
    ): Promise<Task> {
        return this.tasksServices.updateTaskStatus(id, status, user);
    }

    @Delete(':id')
    deleteTask(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<void> {
        return this.tasksServices.deleteTask(id, user);
    }

}
