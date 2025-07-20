import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteEpisode } from './favorite-episode.entity';
import { FavoriteEpisodeController } from './favorite.controller';
import { FavoriteEpisodeService } from './favorite.service';

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteEpisode])],
  controllers: [FavoriteEpisodeController],
  providers: [FavoriteEpisodeService],
  exports: [FavoriteEpisodeService],
})
export class FavoriteEpisodeModule {}
