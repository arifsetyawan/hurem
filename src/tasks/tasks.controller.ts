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
    ParseIntPipe, UseGuards,
} from '@nestjs/common';
import {TasksService} from './tasks.service';
import {CreateTaskDto} from './dto/create-task.dto';
import {GetTasksFilterDto} from './dto/get-tasks-filter.dto';
import {TaskStatusValidationPipe} from './pipes/task-status-validation.pipe';
import {Task} from './tasks.entity';
import {TaskStatus} from './task-status.enum';
import {AuthGuard} from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {

    constructor(private tasksServices: TasksService) {}

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.tasksServices.getTasks(filterDto);
    }

    @Get(':id')
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.tasksServices.getTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksServices.createTask(createTaskDto);
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    ): Promise<Task> {
        return this.tasksServices.updateTaskStatus(id, status);
    }

    @Delete(':id')
    deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.tasksServices.deleteTask(id);
    }

}
