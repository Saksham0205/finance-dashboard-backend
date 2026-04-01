import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

export class UpdateRoleDto {
  @ApiProperty({ enum: Role, example: Role.Analyst })
  @IsEnum(Role)
  role: Role;
}
