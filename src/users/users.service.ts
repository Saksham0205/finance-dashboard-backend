import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll() {
    return this.userModel
      .find()
      .select('-hashedPassword')
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateRole(id: string, role: Role) {
    const user = await this.userModel
      .findByIdAndUpdate(id, { role }, { new: true })
      .select('-hashedPassword')
      .exec();
    if (!user) {
      throw new NotFoundException({ error: 'Not Found', detail: `User ${id} not found` });
    }
    return user;
  }

  async updateStatus(id: string, isActive: boolean) {
    const user = await this.userModel
      .findByIdAndUpdate(id, { isActive }, { new: true })
      .select('-hashedPassword')
      .exec();
    if (!user) {
      throw new NotFoundException({ error: 'Not Found', detail: `User ${id} not found` });
    }
    return user;
  }
}
