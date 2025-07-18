import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class CommentSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  episodeId: number;

  @Column({ default: false })
  commentsDisabled: boolean;
}