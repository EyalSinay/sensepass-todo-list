import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop()
  task: string;

  @Prop()
  done: boolean;

  @Prop()
  isOnEdit: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
