import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique, Column } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
@Unique(['user', 'episodeId'])
export class FavoriteEpisode {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  episodeId: number;
}
