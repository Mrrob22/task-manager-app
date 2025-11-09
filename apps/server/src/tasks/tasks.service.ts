import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { S3Service } from '../upload/s3.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly model: Model<Task>,
    private readonly s3: S3Service,
  ) {}

  findAll() {
    return this.model.find().sort({ createdAt: -1 }).lean();
  }

  create(dto: CreateTaskDto) {
    return this.model.create(dto);
  }

  async update(id: string, dto: UpdateTaskDto) {
    const doc = await this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .lean();
    if (!doc) throw new NotFoundException('Task not found');
    return doc;
  }

  async reorder(
    items: Array<{ id: string; status: Task['status']; order: number }>,
  ) {
    const ops: Parameters<Model<Task>['bulkWrite']>[0] = items.map((i) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(i.id) },
        update: { $set: { status: i.status, order: i.order } },
        upsert: false,
      },
    }));

    const res = await this.model.bulkWrite(ops, { ordered: false });

    return {
      matched: res.matchedCount ?? 0,
      modified: res.modifiedCount ?? 0,
    };
  }

  async remove(id: string) {
    const task = await this.model
      .findById(id)
      .lean<{ _id: string; attachment?: { key?: string } }>();

    if (!task) throw new NotFoundException('Task not found');

    const key = task.attachment?.key;
    if (key) {
      await this.s3.deleteObject(key);
    }
    if (key) {
      console.log('🧹 Deleting from S3:', key);
      await this.s3.deleteObject(key);
    }

    await this.model.findByIdAndDelete(id);
    return { ok: true };
  }
}
