import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create a transaction (admin only)' })
  @ApiResponse({ status: 201, description: 'Transaction created' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(dto);
  }

  @Get()
  @Roles(Role.Viewer)
  @ApiOperation({ summary: 'List transactions with optional filters (all roles)' })
  @ApiResponse({ status: 200, description: 'List of transactions' })
  async findAll(@Query() filters: FilterTransactionDto) {
    return this.transactionsService.findAll(filters);
  }

  @Put(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update a transaction (admin only)' })
  @ApiResponse({ status: 200, description: 'Transaction updated' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    return this.transactionsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete a transaction (admin only)' })
  @ApiResponse({ status: 200, description: 'Transaction deleted' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async delete(@Param('id') id: string) {
    return this.transactionsService.delete(id);
  }
}
