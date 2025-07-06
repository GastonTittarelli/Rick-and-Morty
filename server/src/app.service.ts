import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user/entities/user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    return this.userRepo.find();
  }

  async createUser(): Promise<User> {
    const user = this.userRepo.create({
      email: 'test@example.com',
      password: '123456',
    });
    return this.userRepo.save(user);
  }
}
