import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchUserDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'john', description: 'Search by name (case-insensitive, partial match)' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'john@example.com', description: 'Search by email (case-insensitive, partial match)' })
  email?: string;
}
