import {Body, Controller, Get, Param, Post, Delete, Put, Patch, Query, UsePipes, ValidationPipe, NotFoundException} from '@nestjs/common';
import {TasksService} from './tasks.service';
import {Task, TaskStatus} from './tasks.model';
import {CreateTaskDto} from './dto/create-task.dto';
import {GetTasksFilterDto} from './dto/get-tasks-filter.dto';
import {TaskStatusValidationPipe} from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {

    constructor(private tasksServices: TasksService) {
    }

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {
        if (Object.keys(filterDto).length) {
            return this.tasksServices.getTasksByFilters(filterDto);
        }
        return this.tasksServices.getAllTasks();
    }

    @Get(':id')
    getTaskById(@Param('id') id: string): Task {
        const found = this.tasksServices.getTaskById(id);
        if (!found) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }
        return found;
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto): Task {
        return this.tasksServices.createTask(createTaskDto);
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id') id: string,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    ): Task {
        return this.tasksServices.updateTaskStatus(id, status);
    }

    @Delete(':id')
    deleteTask(@Param('id') id: string) {
        this.tasksServices.deleteTask(id);
    }

}
