import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, FilterQuery } from 'mongoose';
import { Transaction } from './transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  async create(dto: CreateTransactionDto) {
    return this.transactionModel.create({
      userId: new Types.ObjectId(dto.userId),
      amount: dto.amount,
      type: dto.type,
      category: dto.category,
      date: new Date(dto.date),
      notes: dto.notes || '',
    });
  }

  async findAll(filters: FilterTransactionDto) {
    const query: FilterQuery<Transaction> = {};

    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.type) {
      query.type = filters.type;
    }
    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) {
        query.date.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.date.$lte = new Date(filters.endDate);
      }
    }

    return this.transactionModel.find(query).sort({ date: -1 }).exec();
  }

  async update(id: string, dto: UpdateTransactionDto) {
    const updateData: Record<string, unknown> = { ...dto };
    if (dto.date) {
      updateData.date = new Date(dto.date);
    }

    const transaction = await this.transactionModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!transaction) {
      throw new NotFoundException({
        error: 'Not Found',
        detail: `Transaction ${id} not found`,
      });
    }
    return transaction;
  }

  async delete(id: string) {
    const transaction = await this.transactionModel.findByIdAndDelete(id).exec();
    if (!transaction) {
      throw new NotFoundException({
        error: 'Not Found',
        detail: `Transaction ${id} not found`,
      });
    }
    return { message: 'Transaction deleted successfully' };
  }
}
