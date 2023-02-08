import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schemas/task.schema';
import { TaskGateway } from './task.gateway';
import { TasksRepository } from './tasks.repository';
import { TaskService } from './tasks.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  controllers: [],
  providers: [TaskService, TasksRepository, TaskGateway],
})
export class TasksModule {}
