import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsMongoId,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ReorderStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}
export class ReorderItemDto {
  @IsMongoId()
  id!: string;

  @IsEnum(ReorderStatus)
  status!: 'todo' | 'in_progress' | 'done';

  @IsInt()
  @Min(0)
  order!: number;
}

export class ReorderTasksDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ReorderItemDto)
  items!: ReorderItemDto[];
}
