import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { omit } from 'lodash';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async register(input: RegisterDto) {
    return {
      data: omit(await this.userService.create(input), ['password']),
      message: 'success',
    };
  }

  async login(input: LoginDto) {
    const data = await this.userService.findOne(undefined, input.email);

    if (!data || !(await bcrypt.compare(input.password, data.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: data.id };

    return {
      data: omit(data, ['password']),
      token: await this.jwtService.signAsync(payload),
    };
  }
}
