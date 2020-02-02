import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateTaskDto} from './dto/create-task.dto';
import {TasksRepository} from './tasks.repository';
import {InjectRepository} from '@nestjs/typeorm';
import {Task} from './tasks.entity';
import {TaskStatus} from './task-status.enum';
import {GetTasksFilterDto} from './dto/get-tasks-filter.dto';
import {User} from '../auth/user.entity';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TasksRepository)
        private taskRepository: TasksRepository,
    ) {}

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user);
    }

    // getAllTasks(): Task[] {
    //     return this.tasks;
    // }
    //
    // getTasksByFilters(filterDto: GetTasksFilterDto): Task[] {
    //     const { status, search } = filterDto;
    //     let tasks = this.getAllTasks();
    //
    //     if (status) {
    //         tasks = tasks.filter(task => task.status === status);
    //     }
    //
    //     if (search) {
    //         tasks = tasks.filter(task =>
    //             task.title.includes(search) ||
    //             task.description.includes(search),
    //         );
    //     }
    //
    //     return tasks;
    // }

    async getTaskById(
        id: number,
        user: User,
    ): Promise<Task> {
        const found = await this.taskRepository.findOne({ where: {id, userId: user.id} });
        if (!found) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return found;
    }

    async createTask(
        createTaskDto: CreateTaskDto,
        user: User,
    ): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await task.save();

        return task;
    }

    async deleteTask(id: number, user: User): Promise<void> {
        const result = await this.taskRepository.delete({id, userId: user.id});
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
    }
}
