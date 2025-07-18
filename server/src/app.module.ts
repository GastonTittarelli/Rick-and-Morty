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
    }),
    TypeOrmModule.forFeature([User, Comment, CommentSetting]), // Importamos las entidades que vamos a usar
    AuthModule,
    CommentModule, 
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
