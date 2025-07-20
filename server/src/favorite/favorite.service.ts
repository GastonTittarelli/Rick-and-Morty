import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteEpisode } from './favorite-episode.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FavoriteEpisodeService {
  constructor(
    @InjectRepository(FavoriteEpisode)
    private favoriteRepo: Repository<FavoriteEpisode>,
  ) {}

  async toggleFavorite(user: User, episodeId: number) {
    const existing = await this.favoriteRepo.findOne({
      where: { user, episodeId },
    });

    if (existing) {
      await this.favoriteRepo.remove(existing);
      return { removed: true };
    } else {
      const newFav = this.favoriteRepo.create({ user, episodeId });
      await this.favoriteRepo.save(newFav);
      return { added: true };
    }
  }

  async getFavorites(user: User) {
    return this.favoriteRepo.find({ where: { user } });
  }

  async isFavorite(user: User, episodeId: number) {
    const fav = await this.favoriteRepo.findOne({ where: { user, episodeId } });
    return !!fav;
  }

  async removeFavorite(user: User, episodeId: number) {
  const favorite = await this.favoriteRepo.findOne({
    where: { user, episodeId },
  });

  if (!favorite) {
    return { message: 'Favorite not found' };
  }

  await this.favoriteRepo.remove(favorite);
  return { message: 'Favorite removed successfully' };
}
}
