import {
  WebSocketGateway,
  MessageBody,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Task } from './schemas/task.schema';

@WebSocketGateway()
export class TaskGateway {
  @WebSocketServer()
  server;

  @SubscribeMessage('new-task')
  handleMessage(@MessageBody() task: string): void {
    const newTask: Task = { task, done: false };
    this.server.emit('new-task', newTask);
  }
}
