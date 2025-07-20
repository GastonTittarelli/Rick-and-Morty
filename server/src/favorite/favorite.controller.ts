import { Controller, Post, Get, Body, UseGuards, Request, Delete, Param } from '@nestjs/common';
import { FavoriteEpisodeService } from './favorite.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('favorites')
export class FavoriteEpisodeController {
  constructor(private readonly favoriteService: FavoriteEpisodeService) {}

  @Post('toggle')
  @UseGuards(AuthGuard('jwt'))
  async toggleFavorite(@Request() req, @Body('episodeId') episodeId: number) {
    return this.favoriteService.toggleFavorite(req.user, episodeId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getFavorites(@Request() req) {
    return this.favoriteService.getFavorites(req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async removeFavorite(@Request() req, @Param('id') id: number) {
    return this.favoriteService.removeFavorite(req.user, +id);
  }
}
