import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPostController } from './blog-post.controller';
import { BlogPostService } from './blog-post.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { Blog } from './entities/blog.entity';
import { Likes } from 'src/like/entities/like.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog, Likes]),UsersModule, CloudinaryModule],
  controllers: [BlogPostController],
  providers: [BlogPostService, JwtGuard, JwtService, UsersService],
  exports: [BlogPostService],
})
export class BlogPostModule {}
