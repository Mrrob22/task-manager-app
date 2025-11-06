import { IsEnum, IsOptional, IsString, MaxLength, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AssigneeDto {
  @IsString() id!: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() avatarUrl?: string;
  @IsOptional() @IsString() email?: string;
}

class AttachmentDto {
  @IsOptional() @IsString() url?: string;
  @IsOptional() @IsString() key?: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() size?: number;
  @IsOptional() @IsString() type?: string;
}

export class CreateTaskDto {
  @IsString() title!: string;
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
  @IsEnum(['low','medium','high']) priority!: 'low'|'medium'|'high';
  @IsOptional() @IsDateString() dueDate?: string;
  @IsEnum(['todo','in_progress','done']) status!: 'todo'|'in_progress'|'done';

  @IsOptional() @ValidateNested() @Type(() => AssigneeDto) assignee?: AssigneeDto;
  @IsOptional() @ValidateNested() @Type(() => AttachmentDto) attachment?: AttachmentDto;
}
