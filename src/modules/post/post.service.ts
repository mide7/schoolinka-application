import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { FindPostsDto } from './dto/find-posts.dto';
import { queryHelper } from '@/lib';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createPostDto: CreatePostDto, authorId: number) {
    return await this.prisma.post.create({
      data: {
        ...createPostDto,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
    });
  }

  async findAll(query: FindPostsDto, authorId?: number) {
    const { skip, order, page, search, size, sort, published } =
      queryHelper(query);

    const [data, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        include: {
          author: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        where: {
          authorId,
          OR: search
            ? [
                {
                  title: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
                {
                  author: {
                    username: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  },
                },
              ]
            : undefined,
          AND:
            published === 'true'
              ? {
                  published: true,
                }
              : published === 'false'
              ? {
                  published: false,
                }
              : undefined,
        },
        orderBy: { [sort]: order },
        skip,
        take: size,
      }),
      this.prisma.post.count({
        where: {
          OR: search
            ? [
                {
                  title: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
                {
                  author: {
                    username: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  },
                },
              ]
            : undefined,
          AND:
            published === 'true'
              ? {
                  published: true,
                }
              : published === 'false'
              ? {
                  published: false,
                }
              : undefined,
        },
      }),
    ]);

    return { data, page, size, total, sort, order };
  }

  async findOne(id: number) {
    return await this.prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  async update(id: number, authorId: number, updatePostDto: UpdatePostDto) {
    return await this.prisma.$transaction(async (tx) => {
      const existingPost = await this.prisma.post.findUnique({
        where: {
          id,
          authorId,
        },
      });

      if (!existingPost) {
        throw new NotFoundException('Post not found');
      }

      return await tx.post.update({
        where: {
          id,
          authorId,
        },
        data: {
          content: updatePostDto.content,
          title: updatePostDto.title,
          published: updatePostDto.published,
        },
      });
    });
  }

  async remove(id: number, authorId: number) {
    if (!id || !authorId) {
      throw new BadRequestException('Invalid Request');
    }
    return this.prisma.$transaction(async (tx) => {
      const existingPost = await tx.post.findUnique({
        where: {
          id,
          authorId,
        },
      });

      if (!existingPost) {
        throw new NotFoundException('Post not found');
      }

      return await tx.post.delete({
        where: {
          id: existingPost.id,
          authorId: existingPost.authorId,
        },
      });
    });
  }
}
