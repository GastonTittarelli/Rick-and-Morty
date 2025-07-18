import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { User } from 'src/user/entities/user.entity';
import { CommentSetting } from 'src/comment-setting/comment-setting.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, CommentSetting]),
  ConfigModule,
],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}