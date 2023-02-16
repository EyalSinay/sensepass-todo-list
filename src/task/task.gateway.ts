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
import { TaskDto } from './task.dto';

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
  async handleNewTask(@MessageBody() text: string): Promise<Task | Error> {
    try {
      const newTask = await this.taskService.createTask({
        text,
        done: false,
        isOnEdit: false,
      });
      console.log('A new task is created.', newTask._id.toString());
      const newTaskDto: TaskDto = {
        _id: newTask._id,
        text: newTask.text,
        done: newTask.done,
        isOnEdit: newTask.isOnEdit,
      };
      this.server.emit('create-task', newTaskDto);
      return newTask;
    } catch (error) {
      console.log('Error in handleNewMessage', error);
      return error;
    }
  }

  @SubscribeMessage('update-task')
  async handleUpdateTask(
    @MessageBody()
    task: TaskDto,
  ): Promise<Task | Error> {
    const taskId = task._id;
    const taskUpdates: Task = {
      text: task.text,
      done: task.done,
      isOnEdit: task.isOnEdit,
    };
    try {
      await this.taskService.updateTask(taskId, taskUpdates);
      console.log('Task:', taskId, 'has been updated to:', taskUpdates);
      this.server.emit('update-task', task);
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
