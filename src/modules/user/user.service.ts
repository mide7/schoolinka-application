import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { generateHashedPassword } from '@/lib';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const secure_password = await generateHashedPassword(
      createUserDto.password,
    );
    return await this.prisma.user.create({
      data: { ...createUserDto, password: secure_password },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
  }

  async findOne(
    id?: number,
    email?: string,
    relations?: ('post' | '_count')[],
  ) {
    if (!id && !email) {
      throw new BadRequestException('Invalid id or email');
    }

    return await this.prisma.user.findUnique({
      where: { id, email },
      include: {
        posts: Array.isArray(relations)
          ? relations.includes('post')
          : undefined,
        _count: Array.isArray(relations)
          ? relations.includes('_count')
          : undefined,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    let secure_password: string | undefined;
    if (updateUserDto.password)
      secure_password = await generateHashedPassword(updateUserDto.password);
    return await this.prisma.user.update({
      where: { id },
      data: { ...updateUserDto, password: secure_password },
    });
  }

  async remove(id: number) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
