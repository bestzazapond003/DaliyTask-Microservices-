import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto, UpdateStatusDto, QueryTaskDto } from '../../../libs/common/src/dto/task.dto';
import { AllRpcExceptionsFilter } from '../../../libs/common/src/filters/all-rpc-exceptions.filter';

@Controller()
@UseFilters(new AllRpcExceptionsFilter())
export class TaskMicroserviceController {
  constructor(private readonly taskService: TaskService) {}

  @MessagePattern('task.get_list')
  async getTasks(@Payload() payload: { query: QueryTaskDto; userId: string }) {
    return this.taskService.getTasks(payload.query, payload.userId);
  }

  @MessagePattern('task.get_by_id')
  async getTaskById(@Payload() id: string) {
    return this.taskService.getTaskById(id);
  }

  @MessagePattern('task.create')
  async createTask(@Payload() payload: { dto: CreateTaskDto; userId: string }) {
    return this.taskService.createTask(payload.dto, payload.userId);
  }

  @MessagePattern('task.update')
  async updateTask(@Payload() payload: { id: string; dto: UpdateTaskDto }) {
    return this.taskService.updateTask(payload.id, payload.dto);
  }

  @MessagePattern('task.update_status')
  async updateStatus(@Payload() payload: { id: string; dto: UpdateStatusDto }) {
    return this.taskService.updateStatus(payload.id, payload.dto);
  }

  @MessagePattern('task.delete')
  async deleteTask(@Payload() id: string) {
    return this.taskService.deleteTask(id);
  }
}
