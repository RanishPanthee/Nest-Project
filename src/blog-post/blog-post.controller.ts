import { Body, Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Request } from 'express';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Blog } from './entities/blog.entity';
import { Users } from 'src/users/entities/user.entity';

@Controller('blog-post')
export class BlogPostController {
    constructor(private readonly blogPostService: BlogPostService) {}

    @UseGuards(JwtGuard)
    @Post('create') // to post a blog
    async createBlog(@Req() req:Request, @Body() createBlogDto: CreateBlogDto){
        const userId = req.user.userId;

        return this.blogPostService.createBlog(createBlogDto, userId);

    }

    @UseGuards(JwtGuard)
    @Get('my-blogs') // blogs written by a user
    async getMyBlogs(@Req() req): Promise<Blog[]> {
        const userId = req.user.userId;
        return this.blogPostService.findBlogsByUser(userId);
    }


}