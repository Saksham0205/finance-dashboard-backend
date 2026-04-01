import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ example: 1500.5 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ enum: ['income', 'expense'], example: 'income' })
  @IsEnum(['income', 'expense'])
  type: 'income' | 'expense';

  @ApiProperty({ example: 'Salary' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: '2026-01-15' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ example: 'Monthly salary' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: '660a1f2e3b4c5d6e7f8a9b0c' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
