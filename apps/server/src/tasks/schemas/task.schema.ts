import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

export class Attachment {
  @Prop() url?: string;
  @Prop() key?: string;
  @Prop() name?: string;
  @Prop() size?: number;
  @Prop() type?: string;
}

export class Assignee {
  @Prop({ required: true }) id!: string;
  @Prop() name?: string;
  @Prop() avatarUrl?: string;
  @Prop() email?: string;
}

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true }) title!: string;
  @Prop() description?: string;
  @Prop({ enum: ['low', 'medium', 'high'], default: 'medium' })
  priority!: 'low' | 'medium' | 'high';

  @Prop() dueDate?: Date;
  @Prop({ enum: ['todo', 'in_progress', 'done'], default: 'todo' })
  status!: 'todo' | 'in_progress' | 'done';
  @Prop({ type: Number, default: 0 }) order: number;
  @Prop({ type: Object }) assignee?: Assignee;
  @Prop({ type: Object }) attachment?: Attachment;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.index({ status: 1, order: 1 });
