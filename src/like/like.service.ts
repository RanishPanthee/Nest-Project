import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from 'src/blog-post/entities/blog.entity';
import { Users } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Likes } from './entities/like.entity';

@Injectable()
export class LikeService {
  constructor (
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>, 
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(Likes)
    private readonly likesRepository: Repository<Likes>
  ) {}

  async createLike(userId: number, blogId: number) {
    try {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        const blog = await this.blogRepository.findOne({ where: { id: blogId } });
    
        if (!user) {
          throw new Error(`User with ${userId} not found`);
        }
    
        if (!blog) {
          throw new Error('Blog not found');
        }
    
        const alreadyLiked = await this.likesRepository.findOne({ where: {user:{id: userId}, blog:{id: blogId}} });
    
        if (alreadyLiked) {
          await this.likesRepository.remove(alreadyLiked);
          blog.likesCount = Math.max(0, blog.likesCount - 1);
        } else {
          const like = new Likes();
          like.blog = blog;
          like.user = user;
          blog.likesCount = blog.likesCount + 1;
    
          await this.likesRepository.save(like);
        }
    
        await this.blogRepository.save(blog);
        
    } catch (error) {
        throw error
        
    }

  }

  async getLikedBlogs(userId: number): Promise<Blog[]> {
    const likes = await this.likesRepository.find({ where: { user: { id: userId } }, relations: ['blog'] });
    const blogs = likes.map(like => like.blog);
    
    return blogs;
  }

  async getUsersLiked(blogId: number): Promise<Users[]> {
    const likes = await this.likesRepository.find({
        where: { blog: { id: blogId } },
        relations: ['user']
    });
    const users = likes.map(like => like.user);

    return users;
  }
}
