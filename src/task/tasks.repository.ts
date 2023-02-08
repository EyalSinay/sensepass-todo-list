import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';

@Injectable()
export class TasksRepository {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(task: Task): Promise<Task> {
    const newTask = new this.taskModel(task);
    return newTask.save();
  }

  async getAll(): Promise<Task[]> {
    return this.taskModel.find({});
  }

  async findByIdAndUpdate(id: string, task: Partial<Task>): Promise<Task> {
    return this.taskModel.findByIdAndUpdate(id, task);
  }

  async delete(id: string): Promise<Task> {
    return this.taskModel.findByIdAndDelete(id);
  }
}
