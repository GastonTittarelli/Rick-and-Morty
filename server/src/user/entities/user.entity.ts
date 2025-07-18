import { Comment } from 'src/comment/comment.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 15 })
  name: string;

  @Column({ length: 50, unique: true })
  mail: string;

  @Column({ length: 60 }) // bcrypt hashed
  password: string;

  @Column({ type: 'jsonb', nullable: true })
  address: {
    street: string;
    city: string;
    location: string;
    country: string;
    cp: string;
  };

  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @Column({ length: 15, nullable: true })
  phone: string;

  @Column({ default: 'user' })
  role: string;

  @CreateDateColumn()
  date: Date;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ nullable: true })
  location: string;

  @OneToMany(() => Comment, (comment) => comment.user)
comments: Comment[];
}