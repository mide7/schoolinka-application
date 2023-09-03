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
  Query,
  Logger,
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
import { FindUsersDto } from './dto/find-users.dto';

@Controller('user')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({
    status: 200,
    description: 'Posts Fetched successfully',
    schema: {
      properties: {
        data: {
          type: 'array', // Specify that the response is an array
          items: {
            type: 'object', // Define the type of objects in the array
            properties: {
              id: { type: 'number' },
              username: { type: 'string' },
              email: { type: 'string' },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' },
            },
          },
        },
        page: { type: 'number' },
        size: { type: 'number' },
        total: { type: 'number' },
        sort: { type: 'string' },
        order: { type: 'string' },
      },
    },
  })
  async findAll(@Query() query: FindUsersDto) {
    return await this.userService.findAll(query);
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
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
        posts: {
          type: 'array',
          items: { type: 'schema' },
          $ref: '#/components/schemas/Post',
        },
      },
    },
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return omit(await this.userService.findOne(+id, undefined, ['post']), [
      'password',
    ]);
  }

  @UseGuards(AuthGuard)
  @Patch()
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
  async update(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    Logger.debug(req.user, 'update route');
    return omit(await this.userService.update(req?.user?.id, updateUserDto), [
      'password',
    ]);
  }

  @UseGuards(AuthGuard)
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
