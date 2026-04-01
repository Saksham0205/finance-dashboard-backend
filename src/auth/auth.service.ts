import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userModel.findOne({ email: dto.email }).exec();
    if (existing) {
      throw new ConflictException({
        error: 'Conflict',
        detail: 'A user with this email already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({
      name: dto.name,
      email: dto.email,
      hashedPassword,
    });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email }).exec();
    if (!user) {
      throw new UnauthorizedException({
        error: 'Unauthorized',
        detail: 'Invalid email or password',
      });
    }

    if (!user.isActive) {
      throw new UnauthorizedException({
        error: 'Unauthorized',
        detail: 'Account is deactivated',
      });
    }

    const passwordValid = await bcrypt.compare(dto.password, user.hashedPassword);
    if (!passwordValid) {
      throw new UnauthorizedException({
        error: 'Unauthorized',
        detail: 'Invalid email or password',
      });
    }

    const payload = { sub: user._id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
