import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
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
