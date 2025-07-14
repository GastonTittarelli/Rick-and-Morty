import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existing = await this.usersRepo.findOne({
      where: { mail: registerDto.mail },
    });
    if (existing) {
      throw new BadRequestException('Mail already exists');
    }

    if (registerDto.address) {
      const fields = [
        'street',
        'city',
        'location',
        'country',
        'cp',
      ];
      for (const field of fields) {
        if (!registerDto.address[field]) {
          throw new BadRequestException(`Missing field: address.${field}`);
        }
      }
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = this.usersRepo.create({
      ...registerDto,
      password: hashedPassword,
    });

    // console.log('New user before save:', newUser);

    const savedUser = await this.usersRepo.save(newUser);

    const { password, ...userResponse } = savedUser;

    return {
      header: {
        message: 'User created successfully',
        resultCode: 0,
      },
      data: {
        user: userResponse,
      },
    };
  }


  async login(loginDto: LoginDto) {
    const { mail, password } = loginDto;

    const user = await this.usersRepo.findOne({ where: { mail } });

    if (!user) {
      return {
        header: {
          resultCode: 3,
          error: 'Invalid user or password',
        },
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        header: {
          resultCode: 3,
          error: 'Invalid user or password',
        },
      };
    }

    const payload = {
      id: user.id,
      name: user.name,
      mail: user.mail,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    const { password: _, ...userData } = user;

    return {
      header: {
        message: 'authenticated user',
        resultCode: 0,
      },
      data: {
        user: userData,
        token,
      },
    };
  }

  
  async updateProfile(userId: string, dto: UpdateUserDto) {
  const user = await this.usersRepo.findOne({ where: { id: userId } });

  if (!user) {
    throw new BadRequestException('User not found');
  }

  if (dto.nickname !== undefined) user.nickname = dto.nickname;
  if (dto.profilePicture !== undefined) user.profilePicture = dto.profilePicture;

  if (dto.location !== undefined) user.location = dto.location;

  const updated = await this.usersRepo.save(user);

  const { password, ...userWithoutPassword } = updated;

  return {
    header: {
      resultCode: 200,
      message: 'Perfil actualizado',
    },
    data: {
      user: userWithoutPassword,
    },
  };
}

}