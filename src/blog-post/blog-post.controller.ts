import { Body, Controller, Post, UseGuards, Req, Get, Param, Delete, UnauthorizedException, Patch, UploadedFile, UseInterceptors, InternalServerErrorException } from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Blog } from './entities/blog.entity';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';

const allowedFileTypes = ['.jpg', '.png', '.jpeg'];

@Controller('blog-post')
export class BlogPostController {
    constructor(private readonly blogPostService: BlogPostService) {}

    @UseGuards(JwtGuard)
    @Post('create') // to post a blog
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                cb(null, `${file.originalname}`);
            }
        }),
        fileFilter: (req, file, cb) => {
            const fileExt = extname(file.originalname).toLowerCase();
            if (allowedFileTypes.includes(fileExt)) {
                cb(null, true);
            } else {
                cb(new Error('Invalid file type, choose .jpg, .png, or .jpeg'), false);
            }
        }
    }))
    async createBlog(@Req() req: Request, @Body() createBlogDto: CreateBlogDto, @UploadedFile() file: Express.Multer.File) {
        const user = req.user;

        try {
            return await this.blogPostService.createBlog(createBlogDto, user.id, file);
        } catch (error) {
            throw new InternalServerErrorException('Failed to create blog');
        }
    }

    @UseGuards(JwtGuard)
    @Get('my-blogs') // blogs written by a user
    async getMyBlogs(@Req() req): Promise<Blog[]> {
        const userId = req.user.userId;
        return this.blogPostService.findBlogsByUser(userId);
    }

    @Get(':category') //get blog by category
    async getBlogsByCategory(@Param('category') category: string){
        return this.blogPostService.listBlogsByCategory(category);
    }

    @UseGuards(JwtGuard)
    @Delete('delete/:id') // to delete a blog
    async deleteBlog(@Param('id') id: number, @Req() req: Request) {
        const user = req.user;
        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }
        await this.blogPostService.deleteBlog(id, user.id);
        return { message: 'Blog deleted successfully' };
    }

    @UseGuards(JwtGuard)
    @Patch('update/:id') // to update a blog
    async updateBlog(@Param('id') id: number, @Req() req: Request, @Body() updateBlogDto: UpdateBlogDto) {
        const user = req.user;
        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }
        await this.blogPostService.updateBlog(+id, updateBlogDto);
        return { message: 'Blog updated successfully' };
    }
}