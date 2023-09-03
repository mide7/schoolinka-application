import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindUsersDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Page number',
    default: 1,
    minimum: 1,
    required: false,
  })
  page?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Page size',
    default: 10,
    minimum: 1,
    required: false,
  })
  size?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Search by username',
    required: false,
  })
  search?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Sort field',
    required: false,
    enum: ['id', 'username'],
    default: 'id',
  })
  sort?: 'id' | 'username';

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Sort order',
    required: false,
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  order?: 'asc' | 'desc';
}
