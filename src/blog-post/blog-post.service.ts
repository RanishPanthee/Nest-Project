import {Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/users/entities/user.entity';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';

@Injectable()
export class BlogPostService {
    constructor(
        @InjectRepository(Users)
        private userRepository: Repository<Users>,

        @InjectRepository(Blog)
        private blogRepository: Repository<Blog>
    ) { }

    async createBlog(createBlogDto: CreateBlogDto, userId: number) {
        try {

            const user = this.userRepository.findOne({ where: { id: userId } });

            if (!user) {
                throw new NotFoundException(`User with ${userId} not found`);
            }
            const blog = this.blogRepository.create({
                ...createBlogDto,
                authorName: (await user).firstname + ' ' + (await user).lastname
            });

            return await this.blogRepository.save(blog);

        } catch (error) {
            throw error

        }
    }

    
}