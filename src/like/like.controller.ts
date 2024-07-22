import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Blog } from 'src/blog-post/entities/blog.entity';

@Controller('like')
export class LikeController {
    constructor (private readonly likeService: LikeService) {}

    @UseGuards(JwtGuard)
    @Post(':id/create-like') //like blog post
    async likeBlog(@Param('id') blogId: number, @Req() req: Request): Promise<void> {
      const userId = req.user.userId; 
      await this.likeService.createLike(userId, blogId);
    }


    @UseGuards(JwtGuard)
    @Get('liked-blogs') //retrieve blogs liked by particular user
    async getLikedBlogs(@Req() req: Request): Promise<Blog[]> {
        const userId = req.user.userId;

        if (!userId) {
            throw new Error('User ID not found in request');
        }

        return this.likeService.getLikedBlogs(userId);
    }
}
