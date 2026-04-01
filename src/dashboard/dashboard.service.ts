import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '../transactions/transaction.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  async getSummary() {
    const result = await this.transactionModel.aggregate([
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] },
          },
          totalExpenses: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalIncome: 1,
          totalExpenses: 1,
          netBalance: { $subtract: ['$totalIncome', '$totalExpenses'] },
        },
      },
    ]);

    return result[0] || { totalIncome: 0, totalExpenses: 0, netBalance: 0 };
  }

  async getRecent() {
    return this.transactionModel.aggregate([
      { $sort: { date: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 1,
          userId: 1,
          amount: 1,
          type: 1,
          category: 1,
          date: 1,
          notes: 1,
        },
      },
    ]);
  }

  async getByCategory() {
    return this.transactionModel.aggregate([
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id.category',
          type: '$_id.type',
          total: 1,
          count: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);
  }

  async getTrends() {
    return this.transactionModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          totalIncome: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] },
          },
          totalExpenses: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] },
          },
          transactionCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          totalIncome: 1,
          totalExpenses: 1,
          netBalance: { $subtract: ['$totalIncome', '$totalExpenses'] },
          transactionCount: 1,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]);
  }
}
