import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('summary')
  @Roles(Role.Viewer)
  @ApiOperation({ summary: 'Get total income, expenses, and net balance (all roles)' })
  @ApiResponse({ status: 200, description: 'Financial summary' })
  async getSummary() {
    return this.dashboardService.getSummary();
  }

  @Get('recent')
  @Roles(Role.Viewer)
  @ApiOperation({ summary: 'Get last 10 transactions (all roles)' })
  @ApiResponse({ status: 200, description: 'Recent transactions' })
  async getRecent() {
    return this.dashboardService.getRecent();
  }

  @Get('by-category')
  @Roles(Role.Analyst)
  @ApiOperation({ summary: 'Get totals grouped by category (analyst + admin)' })
  @ApiResponse({ status: 200, description: 'Category breakdown' })
  @ApiResponse({ status: 403, description: 'Forbidden — requires analyst or admin role' })
  async getByCategory() {
    return this.dashboardService.getByCategory();
  }

  @Get('trends')
  @Roles(Role.Analyst)
  @ApiOperation({ summary: 'Get monthly income vs expenses breakdown (analyst + admin)' })
  @ApiResponse({ status: 200, description: 'Monthly trends' })
  @ApiResponse({ status: 403, description: 'Forbidden — requires analyst or admin role' })
  async getTrends() {
    return this.dashboardService.getTrends();
  }
}
