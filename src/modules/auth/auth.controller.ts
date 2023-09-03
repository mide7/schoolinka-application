import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      properties: {
        id: { type: 'number' },
        username: { type: 'string' },
        email: { type: 'string' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      properties: {
        error: { type: 'string' },
        message: { type: 'string' },
        statusCode: { type: 'number' },
      },
    },
  })
  async register(@Body() input: RegisterDto) {
    return await this.authService.register(input);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      properties: {
        data: {
          properties: {
            id: { type: 'number' },
            username: { type: 'string' },
            email: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        token: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      properties: {
        error: { type: 'string' },
        message: { type: 'string' },
        statusCode: { type: 'number' },
      },
    },
  })
  async login(@Body() input: LoginDto) {
    return await this.authService.login(input);
  }
}
