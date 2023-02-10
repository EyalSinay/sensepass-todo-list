import { OnModuleInit } from '@nestjs/common';
import {
  WebSocketGateway,
  MessageBody,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Task } from './schemas/task.schema';
import { Server } from 'socket.io';
import { TaskService } from './tasks.service';

@WebSocketGateway({ cors: true })
export class TaskGateway implements OnModuleInit {
  constructor(private readonly taskService: TaskService) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', async (socket) => {
      console.log('New connection. id:', socket.id);
      const allTasks = await this.taskService.getAllTasks();
      this.server.emit('new-connection', allTasks);
    });
  }

  @SubscribeMessage('create-task')
  async handleNewTask(@MessageBody() task: string): Promise<Task | Error> {
    const newTask: Task = { task, done: false, isOnEdit: false };
    try {
      await this.taskService.createTask(newTask);
      console.log('A new task is created.', newTask);
      this.server.emit('create-task', newTask);
      return newTask;
    } catch (error) {
      console.log('Error in handleNewMessage', error);
      return error;
    }
  }

  @SubscribeMessage('update-task')
  async handleUpdateTask(
    @MessageBody() taskId: string,
    task: Task,
  ): Promise<Task | Error> {
    try {
      await this.taskService.updateTask(taskId, task);
      console.log('Task:', taskId, 'has been updated to:', task);
      this.server.emit('update-task', { taskId, task });
      return task;
    } catch (error) {
      console.log('Error in handleUpdateTask', error);
      return error;
    }
  }

  @SubscribeMessage('delete-task')
  async handleDeleteTask(
    @MessageBody() taskId: string,
  ): Promise<string | Error> {
    try {
      await this.taskService.deleteTask(taskId);
      console.log('Task:', taskId, 'has been deleted.');
      this.server.emit('delete-task', taskId);
      return taskId;
    } catch (error) {
      console.log('Error in handleDeleteTask', error);
      return error;
    }
  }
}
