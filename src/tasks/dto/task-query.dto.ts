import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import {
  Type,
} from 'class-transformer';

export class TaskQueryDto {

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn([
    'true',
    'false',
  ])
  completed?: string;

  @IsOptional()
  @IsIn([
    'id',
    'title',
    'createdAt',
    'updatedAt',
  ])
  sortBy?:
    | 'id'
    | 'title'
    | 'createdAt'
    | 'updatedAt';

  @IsOptional()
  @IsIn([
    'ASC',
    'DESC',
    'asc',
    'desc',
  ])
  order?:
    | 'ASC'
    | 'DESC'
    | 'asc'
    | 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}