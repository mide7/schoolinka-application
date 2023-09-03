import { Post } from '@prisma/client';
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto implements Pick<Post, 'title' | 'content'> {
  @IsString()
  @MinLength(3)
  @ApiProperty({
    description: 'Blog post title',
    minLength: 3,
  })
  title: string;

  @IsString()
  @MinLength(12)
  @ApiProperty({
    description: 'Blog post description',
    minLength: 12,
  })
  content: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Blog post publish status',
    minLength: 3,
  })
  published?: boolean;
}
