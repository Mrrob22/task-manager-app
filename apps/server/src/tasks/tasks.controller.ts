import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('api/tasks')
export class TasksController {
  constructor(private readonly service: TasksService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
