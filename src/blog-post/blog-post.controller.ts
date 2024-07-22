import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Request } from 'express';
import { CreateBlogDto } from './dto/create-blog.dto';

@Controller('blog-post')
export class BlogPostController {
    constructor(private readonly blogPostService: BlogPostService) {}

    @UseGuards(JwtGuard)
    @Post('create')
    async createBlog(@Req() req:Request, @Body() createBlogDto: CreateBlogDto){
        const userId = req.user.userId;

        return this.blogPostService.createBlog(createBlogDto, userId);

    }


}