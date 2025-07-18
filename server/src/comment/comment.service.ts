import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CreateCommentDto } from 'src/auth/dto/create-comment.dto';
import { Comment } from './comment.entity';
import { UpdateCommentDto } from 'src/auth/dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createDto: CreateCommentDto, userId: string) {
    const user = await this.userRepo.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
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

  if (comment.user.id !== userId) {
    throw new ForbiddenException('You can only delete your own comments');
  }

  await this.commentRepo.delete(commentId);
  return { message: 'Comment deleted' };
}
}
