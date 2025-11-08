import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async onModuleInit() {
    const count = await this.userModel.countDocuments();
    if (count === 0) {
      await this.userModel.insertMany([
        { name: 'Atlas OK', email: 'atlas@example.com' },
      ]);
    }
  }

  findAll(q?: string) {
    if (q?.trim()) {
      const rx = new RegExp(q.trim(), 'i');
      return this.userModel.find({ $or: [{ name: rx }, { email: rx }] }).lean();
    }
    return this.userModel.find().lean();
  }

  async create(dto: CreateUserDto) {
    return this.userModel.create(dto);
  }
}
