import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CreateCommentDto } from 'src/auth/dto/create-comment.dto';
import { Comment } from './comment.entity';
import { UpdateCommentDto } from 'src/auth/dto/update-comment.dto';
import { CommentSetting } from 'src/comment-setting/comment-setting.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(CommentSetting)
    private settingRepo: Repository<CommentSetting>,
  ) {}

  async create(createDto: CreateCommentDto, userId: string) {
    const user = await this.userRepo.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const setting = await this.settingRepo.findOneBy({ episodeId: createDto.episodeId });
    if (setting?.commentsDisabled) {
      throw new ForbiddenException('Comments are disabled for this episode');
    }

    const comment = this.commentRepo.create({
      content: createDto.content,
      episodeId: createDto.episodeId,
      user,
    });

    return this.commentRepo.save(comment);
  }

  async findByEpisode(episodeId: number) {
    return this.commentRepo.find({
      where: { episodeId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(commentId: number, dto: UpdateCommentDto, userId: string) {
  const comment = await this.commentRepo.findOne({
    where: { id: commentId },
    relations: ['user'],
  });
  if (!comment) throw new NotFoundException('Comment not found');

  if (comment.user.id !== userId) {
    throw new ForbiddenException('You can only edit your own comments');
  }

  comment.content = dto.content;
  return this.commentRepo.save(comment);
}

async delete(commentId: number, userId: string) {
  const comment = await this.commentRepo.findOne({
    where: { id: commentId },
    relations: ['user'],
  });
  if (!comment) throw new NotFoundException('Comment not found');

  const user = await this.userRepo.findOne({ where: { id: userId } });
  if (!user) throw new ForbiddenException('User not found');

  if (comment.user.id !== userId && user.role !== 'admin') {
    throw new ForbiddenException('You can only delete your own comments or you must be admin');
  }

  await this.commentRepo.delete(commentId);
  return { message: 'Comment deleted' };
}

async toggleCommenting(episodeId: number, disable: boolean) {

    let setting = await this.settingRepo.findOneBy({ episodeId });

    if (!setting) {
      setting = this.settingRepo.create({ episodeId, commentsDisabled: disable });
    } else {
      setting.commentsDisabled = disable;
    }

    return this.settingRepo.save(setting);
  }

  async isCommentingDisabled(episodeId: number): Promise<boolean> {
    const setting = await this.settingRepo.findOneBy({ episodeId });
    return setting?.commentsDisabled ?? false;
  }
}
