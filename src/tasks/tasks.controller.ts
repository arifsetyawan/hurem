import {Body, Controller, Get, Post} from '@nestjs/common';
import {TasksService} from './tasks.service';
import {Task} from './tasks.model';
import {CreateTaskDto} from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {

    constructor(private tasksServices: TasksService){}

    @Get()
    getAllTasks(): Task[] {
        return this.tasksServices.getAllTasks();
    }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto): Task {
        return this.tasksServices.createTask(createTaskDto);
    }

}
