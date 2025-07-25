import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Param,
  UseGuards,
  Delete,
  Patch,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommentDto } from 'src/auth/dto/create-comment.dto';
import { UpdateCommentDto } from 'src/auth/dto/update-comment.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() dto: CreateCommentDto, @Req() req) {
    const userId: string = req.user.id;
    return this.commentService.create(dto, userId);
  }

  @Get('episode/:id')
  findByEpisode(@Param('id') episodeId: number) {
    return this.commentService.findByEpisode(episodeId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateComment(@Param('id') id: string, @Body() dto: UpdateCommentDto, @Req() req) {
    const userId = req.user.id;
    return this.commentService.update(+id, dto, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteComment(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    return this.commentService.delete(+id, userId);
  }

  @Patch('episode/:id/disable-comments')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  disableComments(@Param('id') episodeId: number) {
    return this.commentService.toggleCommenting(+episodeId, true);
  }

  @Patch('episode/:id/enable-comments')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  enableComments(@Param('id') episodeId: number) {
    return this.commentService.toggleCommenting(+episodeId, false);
  }

  @Get('episode/:id/disabled')
  isDisabled(@Param('id') episodeId: number) {
    return this.commentService.isCommentingDisabled(+episodeId);
  }
}
