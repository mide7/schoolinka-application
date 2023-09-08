import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FindPostsDto } from './dto/find-posts.dto';
import { AuthGuard } from '@/guards/auth';

@Controller('post')
@ApiTags('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a blog post' })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    schema: {
      properties: {
        id: { type: 'number' },
        title: { type: 'string' },
        content: { type: 'string' },
        published: { type: 'boolean' },
        authorId: { type: 'number' },
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
  create(@Request() req, @Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto, req?.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'Find blog posts' })
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
              title: { type: 'string' },
              content: { type: 'string' },
              published: { type: 'boolean' },
              authorId: { type: 'number' },
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
  async findAll(@Query() query: FindPostsDto) {
    return await this.postService.findAll(query);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find my blog posts' })
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
              title: { type: 'string' },
              content: { type: 'string' },
              published: { type: 'boolean' },
              authorId: { type: 'number' },
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
  async findAllByUser(@Request() req, @Query() query: FindPostsDto) {
    return await this.postService.findAll(query, req?.user?.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a single blog post by ID' })
  @ApiResponse({
    status: 200,
    description: 'Post Fetched successfully',
    schema: {
      properties: {
        data: {
          // Define the type of objects in the array
          properties: {
            id: { type: 'number' },
            title: { type: 'string' },
            content: { type: 'string' },
            published: { type: 'boolean' },
            authorId: { type: 'number' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
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
  async findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return { data: await this.postService.findOne(id) };
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update blog post' })
  @ApiResponse({
    status: 200,
    description: 'Post Updated successfully',
    schema: {
      properties: {
        data: {
          properties: {
            id: { type: 'number' },
            title: { type: 'string' },
            content: { type: 'string' },
            published: { type: 'boolean' },
            authorId: { type: 'number' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        message: { type: 'string' },
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
  async update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return {
      data: await this.postService.update(id, req?.user?.id, updatePostDto),
      message: 'Updated successfully',
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete blog post' })
  @ApiResponse({
    status: 200,
    description: 'Post Deleted successfully',
    schema: {
      properties: {
        data: {
          properties: {
            id: { type: 'number' },
            title: { type: 'string' },
            content: { type: 'string' },
            published: { type: 'boolean' },
            authorId: { type: 'number' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        message: { type: 'string' },
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
  async remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return {
      data: await this.postService.remove(id, req?.user?.id),
      message: 'Deleted successfully',
    };
  }
}
