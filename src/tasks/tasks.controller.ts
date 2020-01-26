import {Body, Controller, Get, Param, Post, Delete, Put, Patch, Query} from '@nestjs/common';
import {TasksService} from './tasks.service';
import {Task, TaskStatus} from './tasks.model';
import {CreateTaskDto} from './dto/create-task.dto';
import {GetTasksFilterDto} from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {

    constructor(private tasksServices: TasksService) {
    }

    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
        if (Object.keys(filterDto).length) {
            return this.tasksServices.getTasksByFilters(filterDto);
        }
        return this.tasksServices.getAllTasks();
    }

    @Get(':id')
    getTaskById(@Param('id') id: string): Task {
        return this.tasksServices.getTaskById(id);
    }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto): Task {
        return this.tasksServices.createTask(createTaskDto);
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id') id: string,
        @Body('status') status: TaskStatus,
    ): Task {
        return this.tasksServices.updateTaskStatus(id, status);
    }

    @Delete(':id')
    deleteTask(@Param('id') id: string) {
        this.tasksServices.deleteTask(id);
    }

}
