import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/users/entities/user.entity';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class BlogPostService {
    constructor(
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
        @InjectRepository(Blog)
        private blogRepository: Repository<Blog>,
        private readonly cloudinaryService: CloudinaryService 
    ) {}

    async createBlog(createBlogDto: CreateBlogDto, userId: number, file?: Express.Multer.File) {
        try {
            const user = await this.userRepository.findOne({ where: { id: userId } });

            if (!user) {
                throw new NotFoundException(`User with ID ${userId} not found`);
            }

            let imageUrl: string = null;
            if (file) {
                const uploadResult = await this.cloudinaryService.uploadFile(file); 
                imageUrl = uploadResult.secure_url;
            }

            const blog = this.blogRepository.create({
                ...createBlogDto,
                authorName: `${user.firstname} ${user.lastname}`,
                author: user,
                imageUrl
            });

            return this.blogRepository.save(blog);
        } catch (error) {
            throw error;
        }
    }

    async findBlogsByUser(userId: number): Promise<Blog[]> {
        try {
            const user = await this.userRepository.findOne(
                {where: {id: userId}
            });
            const author = await `${user.firstname} ${user.lastname}` ;

            return this.blogRepository.find(
                { where: { authorName: author } 
            });
            
        } catch (error) {
            throw error
        }
    }

    async listBlogsByCategory(blogCategory: string): Promise <Blog[]>{
        try {
            const blog = await this.blogRepository.find(
                {where: {category: blogCategory}
            })
            return blog  

        } catch (error) {
            throw error
            
        }

    }

    async findOne(id: number): Promise<Blog> {
        const blog = await this.blogRepository.findOne({
            where: { id },
            relations: ['author']
        });
        if (!blog) {
            throw new NotFoundException(`Blog with ID ${id} not found`);
        }

        return blog;
    }

    async deleteBlog(blogId: number, userId: number): Promise<void> {
        const blog = await this.findOne(blogId);
   
        if (!blog.author) {
            throw new NotFoundException('Blog author not found');
        }
        
        if (blog.author.id !== userId) {
            throw new ForbiddenException('You do not have permission to delete this blog');
        }

        await this.blogRepository.remove(blog);
    }

    async updateBlog(id: number, updateBlogDto: UpdateBlogDto): Promise<Blog>{
        await this.findOne(id);
        await this.blogRepository.update(id, updateBlogDto);
        return this.findOne(id)
    }
}