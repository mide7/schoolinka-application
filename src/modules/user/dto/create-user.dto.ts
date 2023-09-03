import { User } from '@prisma/client';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto
  implements Omit<User, 'id' | 'created_at' | 'updated_at'>
{
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @ApiProperty({
    description: 'The username of the user (3-30 characters)',
    minLength: 3,
    maxLength: 30,
  })
  username: string;

  @IsEmail()
  @ApiProperty({ description: 'The email address of the user' })
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({
    description: 'The password of the user (minimum 8 characters)',
  })
  password: string;
}
