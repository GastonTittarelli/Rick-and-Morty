import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

   @Get('users')
  getUsers() {
    return this.appService.getUsers();
  }

  @Post('users')
  createUser() {
    return this.appService.createUser();
  }
}
