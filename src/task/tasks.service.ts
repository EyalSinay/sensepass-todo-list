import { Injectable } from '@nestjs/common/decorators';
import { Task } from './schemas/task.schema';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TaskService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async createTask(task: Task): Promise<Task> {
    return this.tasksRepository.create(task);
  }

  async getAllTasks(): Promise<Task[]> {
    return this.tasksRepository.getAll();
  }

  async updateTask(taskId: string, taskUpdates: Task): Promise<Task> {
    return this.tasksRepository.findByIdAndUpdate(taskId, taskUpdates);
  }

  async deleteTask(taskId: string): Promise<Task> {
    return this.tasksRepository.delete(taskId);
  }
}
