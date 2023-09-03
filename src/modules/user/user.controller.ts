import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { omit } from 'lodash';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@/guards/auth';

@Controller('user')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    schema: {
      properties: {
        id: { type: 'number' },
        username: { type: 'string' },
        email: { type: 'string' },
        posts: {
          type: 'array',
          items: { type: 'schema' },
          $ref: '#/components/schemas/Post',
        },
      },
    },
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return omit(await this.userService.findOne(+id), ['password']);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
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
  @Patch()
  async update(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    return omit(await this.userService.update(req?.user?.id, updateUserDto), [
      'password',
    ]);
  }

  @Delete()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a account and posts' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
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
  async remove(@Request() req: any) {
    return omit(await this.userService.remove(req?.user?.id), ['password']);
  }
}
