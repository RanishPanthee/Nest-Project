import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Likes } from './entities/like.entity';
import { Blog } from 'src/blog-post/entities/blog.entity';
import { Users } from 'src/users/entities/user.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Likes, Blog, Users])],
  providers: [LikeService, JwtGuard, JwtService, UsersService],
  controllers: [LikeController]
})
export class LikeModule {}
