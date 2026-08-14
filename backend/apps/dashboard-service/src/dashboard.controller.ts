import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DashboardService } from './dashboard.service';
import { AllRpcExceptionsFilter } from '../../../libs/common/src/filters/all-rpc-exceptions.filter';

@Controller()
@UseFilters(new AllRpcExceptionsFilter())
export class DashboardMicroserviceController {
  constructor(private readonly dashboardService: DashboardService) {}

  @MessagePattern('dashboard.get_stats')
  async getStats(@Payload() payload: { startDate?: string; endDate?: string; userId?: string }) {
    return this.dashboardService.getStats(payload.startDate, payload.endDate, payload.userId);
  }

  @MessagePattern('dashboard.get_workload')
  async getWorkload(@Payload() payload: { startDate?: string; endDate?: string }) {
    return this.dashboardService.getWorkload(payload.startDate, payload.endDate);
  }

  @MessagePattern('dashboard.get_trends')
  async getTrends(@Payload() payload: { startDate?: string; endDate?: string }) {
    return this.dashboardService.getTrends(payload.startDate, payload.endDate);
  }
}
