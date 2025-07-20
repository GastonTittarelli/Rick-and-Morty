import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { Comment } from './comment/comment.entity';
import { CommentModule } from './comment/comment.module';
import { CommentSetting } from './comment-setting/comment-setting.entity';
import { FavoriteEpisode } from './favorite/favorite-episode.entity';
import { FavoriteEpisodeModule } from './favorite/favorite.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true,}), // con esto leo el .env
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'teslo_db',
      autoLoadEntities: true,
      synchronize: true, // solo en desarrollo
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }),
    TypeOrmModule.forFeature([User, Comment, CommentSetting, FavoriteEpisode]), // Importamos las entidades que vamos a usar
    AuthModule,
    CommentModule,
    FavoriteEpisodeModule, 
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
